import Modbus from 'jsmodbus';
import net from 'net';
import { EventEmitter } from 'events';

class ModbusClient extends EventEmitter {
    /**
     * @param {object} options
     * @param {string}  options.host                 - Modbus server host
     * @param {number} [options.port=502]            - Modbus server port
     * @param {number} [options.unitId=1]            - default unit/slave ID
     * @param {number} [options.timeout=5000]        - request timeout in ms
     * @param {boolean}[options.autoReconnect=true]  - reconnect on close/error
     * @param {number} [options.reconnectDelay=1000] - fixed delay between reconnect attempts (ms)
     */
    constructor({
        host,
        port = 502,
        unitId = 1,
        timeout = 5000,
        autoReconnect = true,
        reconnectDelay = 1000,
    } = {}) {
        super();

        this._host = host;
        this._port = port;
        this._unitId = unitId;
        this._timeout = timeout;

        this._autoReconnect = autoReconnect;
        this._reconnectDelay = reconnectDelay;
        this._reconnectTimer = null;
        this._destroyed = false;      // set by destroy() — prevents any further reconnects
        this._connected = false;

        // Promise chain — acts as a mutex so slaveId/transactionId are
        // only mutated when the line is idle (no in-flight request).
        this._chain = Promise.resolve();

        this._socket = null;
        this._client = null;

        this.connect();
    }

    // ── Connection ─────────────────────────────────────────────────────────

    /**
     * (Re-)create the TCP socket and jsmodbus client.
     * Safe to call multiple times — cleans up the previous socket first.
     */
    connect() {
        if (this._destroyed) return;

        // Tear down any existing socket without triggering another reconnect
        this._cleanupSocket();

        this._socket = net.createConnection({ host: this._host, port: this._port });
        this._client = new Modbus.client.TCP(this._socket, this._unitId, this._timeout);

        this._socket.on('connect', () => {
            this._connected = true;
            this.emit('connect');
        });

        this._socket.on('data', (data) => this.emit('data', data));

        this._socket.on('error', (err) => {
            // Suppress ECONNRESET / EPIPE noise after we've already scheduled a reconnect
            this.emit('error', err);
        });

        this._socket.on('timeout', () => this.emit('timeout'));

        this._socket.on('close', (hadError) => {
            this._connected = false;
            this.emit('close', hadError);
            this._scheduleReconnect();
        });
    }

    /** @returns {boolean} true if the socket is currently connected */
    get isConnected() {
        return this._connected;
    }

    // ── Reconnect logic ────────────────────────────────────────────────────

    _scheduleReconnect() {
        if (this._destroyed || !this._autoReconnect) return;
        if (this._reconnectTimer) return; // already scheduled

        this.emit('reconnecting', { delay: this._reconnectDelay });

        this._reconnectTimer = setTimeout(() => {
            this._reconnectTimer = null;
            this.connect();
        }, this._reconnectDelay);
    }

    /** Destroy the current socket without emitting a close event. */
    _cleanupSocket() {
        if (!this._socket) return;
        // Remove all listeners before destroying so the 'close' handler does
        // not trigger another _scheduleReconnect call.
        this._socket.removeAllListeners();
        this._socket.destroy();
        this._socket = null;
        this._client = null;
        this._connected = false;
    }

    // ── State ──────────────────────────────────────────────────────────────

    /** @returns {boolean} true when a request is currently in-flight */
    isBusy() {
        return this._client?._requestHandler?._currentRequest !== null;
    }

    // ── Setters ────────────────────────────────────────────────────────────

    /**
     * Dynamically change the unit/slave ID.
     * `slaveId` is a read-only getter in jsmodbus, so we write the
     * backing fields directly.
     * @param {number} id
     */
    setSlaveId(id) {
        this._client._unitId = id;
        this._client._requestHandler._unitId = id;
    }

    /**
     * Force the MBAP transaction ID for the *next* request.
     * register() increments _requestId before use, so we pre-set to (id - 1).
     * Valid range: 0x0001 – 0xFFFE.
     * @param {number} id
     */
    setTransactionId(id) {
        // (id - 1 + 0xFFFF) % 0xFFFF handles the id=0 edge-case cleanly
        this._client._requestHandler._requestId = (id - 1 + 0xFFFF) % 0xFFFF;
    }

    /**
     * Change the socket inactivity timeout.
     * Only fires the 'timeout' event — does NOT close the socket automatically.
     * @param {number} ms  0 = disabled
     */
    setSocketTimeout(ms) {
        this._socket?.setTimeout(ms);
    }

    /**
     * Change the jsmodbus request timeout.
     * Affects future requests only; in-flight requests keep their original value.
     * @param {number} ms
     */
    setRequestTimeout(ms) {
        this._timeout = ms;
        if (this._client) {
            this._client._timeout = ms;
            this._client._requestHandler._timeout = ms;
        }
    }

    // ── Requests ───────────────────────────────────────────────────────────

    /**
     * Read holding registers.
     * slaveId (and optional transactionId) are set only after any in-flight
     * request completes, guaranteeing the line is idle at mutation time.
     *
     * @param {number}  slaveId         - unit/slave ID to target
     * @param {number}  start           - start register address
     * @param {number}  count           - number of registers to read
     * @param {number} [transactionId]  - optional MBAP transaction ID (1–65534)
     * @returns {Promise<{ request, response, metrics }>}
     */
    readHoldingRegisters(slaveId, start, count, transactionId) {
        this._chain = this._chain
            .catch(() => { }) // swallow previous errors so the chain never dies
            .then(() => {
                if (!this._client) {
                    throw new Error('Modbus client not connected');
                }
                this.setSlaveId(slaveId);
                if (transactionId !== undefined) {
                    this.setTransactionId(transactionId);
                }
                return this._client.readHoldingRegisters(start, count);
            });
        return this._chain;
    }

    // ── Lifecycle ──────────────────────────────────────────────────────────

    /**
     * Permanently close the connection and disable auto-reconnect.
     * After calling this, the instance should be discarded.
     */
    destroy() {
        this._destroyed = true;
        this._autoReconnect = false;

        if (this._reconnectTimer) {
            clearTimeout(this._reconnectTimer);
            this._reconnectTimer = null;
        }

        this._cleanupSocket();
    }
}

export default ModbusClient;

// ── Usage example ──────────────────────────────────────────────────────────
const modbus = new ModbusClient({
    host: '127.0.0.15',
    port: 502,
    timeout: 100,
    autoReconnect: true,
    reconnectDelay: 1000,   // fixed 1 s between attempts
});

modbus.on('connect', () => console.log('[modbus] connected'));
modbus.on('close', () => console.log('[modbus] connection closed'));
modbus.on('reconnecting', ({ delay }) => console.log(`[modbus] reconnecting in ${delay} ms…`));
modbus.on('error', (err) => console.log('[modbus] error:', err.message));
modbus.on('data', (data) => {
    console.log('[modbus] data =', data, "len = ", data.length)
});

setInterval(() => {
    console.log("---------------------------")
    modbus.readHoldingRegisters(2, 0, 10, 1).then((response) => {
        //console.log(response);
    }).catch((err) => {
        // errors are surfaced here; the client will reconnect automatically
    });

    modbus.readHoldingRegisters(1, 0, 10, 2).then((response) => {
        //console.log(response);
    }).catch((err) => {
        // errors are surfaced here; the client will reconnect automatically
    });
}, 10);