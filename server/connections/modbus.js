import ModbusRTU from "modbus-serial";
import { EventEmitter } from "events";

// ─── Reconnection config ───────────────────────────────────────────────────────
const RECONNECT_BASE_DELAY_MS = 1_000;   // first retry after 1 s
const RECONNECT_MAX_DELAY_MS = 2000;  // cap at 30 s
const RECONNECT_BACKOFF_FACTOR = 1.0001;       // double each attempt
const RECONNECT_MAX_ATTEMPTS = Infinity; // retry forever (set a number to limit)

// ─── Connection states ─────────────────────────────────────────────────────────
const STATE = Object.freeze({
    DISCONNECTED: 0,
    CONNECTING: 1,
    CONNECTED: 2,
    RECONNECTING: 3,
});

// ─── Helper: promise-based sleep ───────────────────────────────────────────────
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

class ModbusClient extends EventEmitter {
    static Clients = [];

    constructor({
        protocol = "tcp",
        ip = "127.0.0.1",
        port = 502,
        serialPort = "COM1",
        isLogger = false,
        slaveId = 1,
        timeout = 5000,
        baudrate = 9600,
        databits = 8,
        parity = "none",
        stopbits = 1,
        T_value = 2500,
        autoReconnect = true,
    }) {
        super();
        this.client = new ModbusRTU();
        this.protocol = protocol;
        this.serialPort = serialPort;
        this.ip = ip;
        this.port = port;
        this.slaveId = slaveId;
        this.timeout = timeout;
        this.baudrate = baudrate;
        this.databits = databits;
        this.parity = parity;
        this.stopbits = stopbits;
        this.isLogger = isLogger;
        this.T_value = T_value;
        this.autoReconnect = autoReconnect;

        // State machine
        this.state = STATE.DISCONNECTED;
        this._reconnectAttempts = 0;
        this._reconnecting = false; // guard against concurrent reconnect loops

        // Polling intervals managed externally via onConn
        this.data = null;
        this.onConn = () => { };

        // Active timers – tracked so we can cancel them on disconnect
        this._pollTimers = [];

        ModbusClient.Clients.push(this);

        // ── Wire up low-level transport events ────────────────────────────────
        this.client.on("close", () => {
            if (this.state === STATE.CONNECTED) {
                console.log(`[ModbusClient ${this.ip}:${this.port}] Connection closed.`);
                this._onDisconnected("Connection closed");
            }
        });

        this.client.on("error", (err) => {
            // Suppress noise while we are already handling a reconnect
            if (this.state === STATE.CONNECTED) {
                console.error(`[ModbusClient ${this.ip}:${this.port}] Transport error:`, err.message);
                this._onDisconnected(err);
            }
        });
    }

    // ── Public API ─────────────────────────────────────────────────────────────

    /**
     * Initiates a single connection attempt.
     * Resolves on success, rejects on failure.
     * Does NOT trigger auto-reconnect on its own.
     */
    async connect() {
        if (this.state === STATE.CONNECTED) return;

        this.state = STATE.CONNECTING;

        if (this.protocol === "tcp") {
            await this.client.connectTCP(this.ip, { port: this.port });
            this.client.setTimeout(this.timeout);
            this.state = STATE.CONNECTED;
        } else if (this.protocol === "rtu") {
            await this.client.connectRTUBuffered(this.serialPort, {
                baudRate: this.baudrate,
                dataBits: this.databits,
                parity: this.parity,
                stopBits: this.stopbits,
            });
            this.client.setTimeout(this.timeout);
            this.state = STATE.CONNECTED;
        } else {
            this.state = STATE.DISCONNECTED;
            throw new Error(`Unsupported protocol: ${this.protocol}`);
        }
    }

    /**
     * Reads one or more memory regions for a given slave ID.
     * @param {number} id        Modbus slave / unit ID
     * @param {Array}  dataArr   [{ fc, start_addr, quantity }]
     * @returns {Promise<Buffer[]>}
     */
    async readMemSpace(id = 1, dataArr = []) {
        this.client.setID(id);
        const promises = dataArr.map((item) => {
            switch (item.fc) {
                case 1: return this.client.readCoils(item.start_addr, item.quantity)
                    .then((v) => v.buffer);
                case 2: return this.client.readDiscreteInputs(item.start_addr, item.quantity)
                    .then((v) => v.buffer);
                case 3: return this.client.readInputRegisters(item.start_addr, item.quantity)
                    .then((v) => v.buffer);
                case 4: return this.client.readHoldingRegisters(item.start_addr, item.quantity)
                    .then((v) => v.buffer);
                default:
                    return Promise.reject(new Error(`Unknown function code: ${item.fc}`));
            }
        });
        return Promise.all(promises);
    }

    /**
     * Register a poll-interval timer that will be automatically cleared on
     * disconnect and restarted after reconnection.
     */
    addPollTimer(intervalMs, fn) {
        const id = setInterval(fn, intervalMs);
        this._pollTimers.push({ id, intervalMs, fn });
        return id;
    }

    /**
     * Gracefully close the connection and disable auto-reconnect.
     */
    async disconnect() {
        this.autoReconnect = false;
        this._clearPollTimers();
        try { this.client.close(); } catch (_) { /* ignore */ }
        this.state = STATE.DISCONNECTED;
        this.emit("disconnected");
    }

    // ── Internal helpers ───────────────────────────────────────────────────────

    /** Called whenever the transport drops unexpectedly. */
    _onDisconnected(reason) {
        this._clearPollTimers();
        this.state = STATE.DISCONNECTED;
        this.emit("connectionLost", reason);

        if (this.autoReconnect && !this._reconnecting) {
            this._startReconnectLoop();
        }
    }

    /** Clear all registered poll timers. */
    _clearPollTimers() {
        this._pollTimers.forEach(({ id }) => clearInterval(id));
        this._pollTimers = [];
    }

    /** Exponential-backoff reconnection loop. Runs until connected or max attempts hit. */
    async _startReconnectLoop() {
        if (this._reconnecting) return; // already running
        this._reconnecting = true;
        this._reconnectAttempts = 0;
        this.state = STATE.RECONNECTING;

        console.log(`[ModbusClient ${this.ip}:${this.port}] Starting reconnection loop…`);
        this.emit("reconnecting", { attempt: 0 });

        while (this.autoReconnect && this._reconnectAttempts < RECONNECT_MAX_ATTEMPTS) {
            this._reconnectAttempts++;
            const delay = Math.min(
                RECONNECT_BASE_DELAY_MS * Math.pow(RECONNECT_BACKOFF_FACTOR, this._reconnectAttempts - 1),
                RECONNECT_MAX_DELAY_MS
            );

            console.log(
                `[ModbusClient ${this.ip}:${this.port}] ` +
                `Reconnect attempt #${this._reconnectAttempts} in ${delay / 1000}s…`
            );
            this.emit("reconnecting", { attempt: this._reconnectAttempts, delayMs: delay });

            await sleep(delay);

            // Abort if we were manually disconnected while waiting
            if (!this.autoReconnect) break;

            try {
                // Destroy stale socket before reconnecting
                try { this.client.close(); } catch (_) { /* ignore */ }

                await this.connect();

                // ── SUCCESS ──────────────────────────────────────────────────
                this._reconnecting = false;
                this._reconnectAttempts = 0;
                console.log(`[ModbusClient ${this.ip}:${this.port}] Reconnected successfully ✓`);
                this.emit("reconnected");
                this.onConn(); // restart polling / user logic
                return;

            } catch (err) {
                console.error(
                    `[ModbusClient ${this.ip}:${this.port}] ` +
                    `Attempt #${this._reconnectAttempts} failed: ${err.message}`
                );
                this.state = STATE.RECONNECTING; // reset state set by connect()
            }
        }

        // Exhausted attempts (only reached if RECONNECT_MAX_ATTEMPTS is finite)
        this._reconnecting = false;
        this.state = STATE.DISCONNECTED;
        console.error(`[ModbusClient ${this.ip}:${this.port}] Gave up reconnecting after ${this._reconnectAttempts} attempts.`);
        this.emit("reconnectFailed", this._reconnectAttempts);
    }
}

// ─── Example usage ─────────────────────────────────────────────────────────────

const inverter1 = new ModbusClient({
    protocol: "tcp",
    ip: "127.0.0.2",
    port: 502,
    slaveId: 2,
    timeout: 3000,
    coilRange: { start: 0, length: 30 },
    holdingRegisterRange: { start: 0, length: 120 },
    autoReconnect: true,
});

// ── Event listeners ────────────────────────────────────────────────────────────

inverter1.on("reconnecting", ({ attempt, delayMs }) => {
    if (attempt > 0)
        console.log(`  ↻ Waiting ${(delayMs / 1000).toFixed(1)}s before attempt #${attempt}…`);
});

inverter1.on("reconnected", () => {
    console.log("  ✓ inverter1 is back online.");
});

inverter1.on("reconnectFailed", (attempts) => {
    console.error(`  ✗ inverter1 reconnect failed after ${attempts} attempts. Manual intervention required.`);
});

inverter1.on("connectionLost", (reason) => {
    console.warn(`  ⚠ inverter1 lost connection: ${reason?.message ?? reason}`);
});

// ── Define what to do once connected (or reconnected) ─────────────────────────

let memList = [

    { slave_id: 3, read: [{ fc: 4, start_addr: 0, quantity: 50 }], penalty: 0 },

];

inverter1.onConn = () => {
    console.log("[onConn] Starting poll loop…");

    inverter1.addPollTimer(500, async () => {
        // Skip if not connected (reconnect may be in progress)
        if (inverter1.state !== STATE.CONNECTED) return;

        for (const mem of memList) {
            // prevent await
            let values = null;
            inverter1.readMemSpace(mem.slave_id, mem.read).then((data) => {
                values = data;
                mem.read.forEach((read, i) => { read.buffer = values[i]; });
                if (mem.penalty > 0) mem.penalty--;
                console.log(`Slave ${mem.slave_id}:`, "Len: ", values.length, ",penality: ", mem.penalty);
            }).catch((err) => {
                console.error(`[poll] Error reading slave ${mem.slave_id}:`, err.message, "penality: ", mem.penalty);
                if (err.errno === "ETIMEDOUT") {
                    if (mem.penalty < 20) mem.penalty++;
                    return;
                    //console.log(err);
                }
                if (inverter1.state === STATE.CONNECTED) {
                    inverter1._onDisconnected(err);
                }
            });

            // Let the transport error / close event drive reconnection.
            // If the client is still "connected" but reads are failing,
            // force-trigger the reconnect path.
            // if slave timeout, don't reconnect


        }
    });
};

// ── Initial connection ────────────────────────────────────────────────────────

inverter1.connect()
    .then(() => {
        console.log("[main] Initial connection established.");
        inverter1.onConn();
    })
    .catch((err) => {
        console.error("[main] Initial connection failed:", err.message);
        // Kick off the reconnect loop manually on first-connect failure
        inverter1._onDisconnected(err);
    });

export { STATE };
export default ModbusClient;

/*
try {
                // prevent await
                let values = null ,
                 inverter1.readMemSpace(mem.slave_id, mem.read);
                mem.read.forEach((read, i) => { read.buffer = values[i]; });
                if (mem.penalty > 0) mem.penalty--;
                console.log(`Slave ${mem.slave_id}:`, values, mem.penalty);
            } catch (err) {
                console.error(`[poll] Error reading slave ${mem.slave_id}:`, err.message, "penality: ", mem.penalty);

                // Let the transport error / close event drive reconnection.
                // If the client is still "connected" but reads are failing,
                // force-trigger the reconnect path.
                // if slave timeout, don't reconnect

                if (err.errno === "ETIMEDOUT") {
                    mem.penalty++;
                    //console.log(err);
                    continue;
                }
                if (inverter1.state === STATE.CONNECTED) {
                    inverter1._onDisconnected(err);
                }
                break; // stop polling this cycle
            }
                */