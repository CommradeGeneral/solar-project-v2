import Modbus from 'jsmodbus';
import net from 'net';
import { EventEmitter } from 'events';


class ModbusClient extends EventEmitter {
    /**
     * @param {object} options
     * @param {string}  options.host                        - Modbus server host
     * @param {number} [options.port=502]                   - Modbus server port
     * @param {number} [options.unitId=1]                   - default unit/slave ID
     * @param {number} [options.timeout=5000]               - request timeout in ms
     * @param {boolean}[options.autoReconnect=true]         - reconnect on close/error
     * @param {number} [options.reconnectDelay=1000]        - initial delay between reconnect attempts (ms)
     * @param {number} [options.maxReconnectDelay=30000]    - maximum back-off delay (ms)
     */
    static ALL_DEVICES = [];
    static STATUS = {
        CONNECTED: 0,
        NON_INITIALIZED: 1,
        DISCONNECTED: 2,
        CONNECTING: 3,
        ERROR: 4,
        CLOSED: 5,
        TIMEOUT: 6
    }
    constructor({
        host,
        port = 502,
        unitId = 1,
        loopDelay = 1000,
        timeout = 5000,
        autoReconnect = true,
        reconnectDelay = 1000,
        maxReconnectDelay = 30000,
        deviceName = "",
        readMemoryArea = [],
        maxReadSize = 100
    } = {}) {
        super();

        this._host = host;
        this._port = port;
        this._unitId = unitId;
        this._timeout = timeout;
        this._loopDelay = loopDelay;
        this._autoReconnect = autoReconnect;
        this._reconnectDelay = reconnectDelay;
        this._reconnectTimer = null;
        this._destroyed = false;      // set by destroy() — prevents any further reconnects
        this._connected = false;
        this.status = ModbusClient.STATUS.NON_INITIALIZED;
        this.isHolding = false;
        this.deviceName = deviceName;
        this.maxReadSize = maxReadSize;

        // Promise chain — acts as a mutex so slaveId/transactionId are
        // only mutated when the line is idle (no in-flight request).
        this._chain = Promise.resolve();

        this._socket = null;
        this._client = null;
        this.readMemoryArea = readMemoryArea.map(item => {
            let size = 0;
            let type = "";
            switch (item.functionCode) {
                case 4:
                case 3:
                    size = item.size * 2;
                    type = 'le';
                    break;
                case 1:
                case 5:
                    size = Math.ceil(item.size / 8);
                    type = 'be';
                    break;
            }
            return {
                start: item.start,
                functionCode: item.functionCode,
                byteSize: size,
                quantity: item.size,
                buffer: Buffer.alloc(size, 0, type),
                unitId: item.slaveID,
                deviceName: item.deviceName
            }
        })
        this.loopTimer = null;
        this.status = ModbusClient.STATUS.NON_INITIALIZED;
        /**
         * 0 = connected
         * 1 = non-initialized
         * 2 = disconnected
         * 3 = connecting
         * 4 = error
         * 5 = closed
         */
        this.connect();
        ModbusClient.ALL_DEVICES.push(this);
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

        this._socket.setTimeout(1000);

        this._socket.on('connect', () => {
            this._connected = true;
            this.status = ModbusClient.STATUS.CONNECTED;
            this.loopTimer = setInterval(() => {
                this.readingLoop();
            }, this._loopDelay);
            this.emit('connect');
        });

        this._socket.on('data', (data) => this.emit('data', data));

        this._socket.on('error', (err) => {
            this.status = ModbusClient.STATUS.ERROR;
            clearInterval(this.loopTimer);
            this.loopTimer = null;
            this.emit('error', err);
        });

        this._socket.on('timeout', () => {
            // Destroy the socket so the 'close' event fires and reconnect is triggered.
            this.status = ModbusClient.STATUS.TIMEOUT;
            /*this.emit('timeout');
            this._socket.destroy();*/
        });

        this._socket.on('close', (hadError) => {
            this._connected = false;
            this.status = ModbusClient.STATUS.CLOSED;
            clearInterval(this.loopTimer);
            this.loopTimer = null;
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

        // Status shows CONNECTING immediately so callers aren't stuck reading CLOSED/ERROR
        this.status = ModbusClient.STATUS.CONNECTING;
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

    readHoldingRegisters2(start, count) {
        return this._client.readHoldingRegisters(start, count);
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

    areaPartition() {
        // divide memory map into blocks of size of maxReadSize or less
        let list = []

        this.readMemoryArea.forEach((item, index) => {
            let accumlatedSize = 0;
            while (accumlatedSize < item.quantity) {
                const chunkSize = Math.min(this.maxReadSize, item.quantity - accumlatedSize);
                list.push({
                    deviceName: item.deviceName,
                    unitId: item.unitId,
                    memoryAreaIndex: index,
                    start: item.start + accumlatedSize,
                    functionCode: item.functionCode,
                    quantity: chunkSize,
                    bufferIndex: accumlatedSize
                });
                // Increment by the actual chunk size, not the raw maxReadSize
                accumlatedSize += chunkSize;
            }
        });
        return list;
    }

    async readingLoop() {
        // Skip if a request is already in-flight or the connection is in error
        if (this.isBusy() || this.status === ModbusClient.STATUS.ERROR) {
            return;
        }
        if (this.isHolding) {
            return;
        }

        this.isHolding = true;
        const chunks = this.areaPartition();

        // Sequential reads — avoid concurrent MBAP frames on the same TCP socket
        for (const item of chunks) {
            // Bail out early if the connection dropped mid-loop
            if (!this._connected || !this._client) break;

            this.setSlaveId(item.unitId);
            try {
                const response = await this._client.readHoldingRegisters(item.start, item.quantity);
                this.status = ModbusClient.STATUS.CONNECTED;
                const buffer = response.response.body.valuesAsBuffer;
                this.emit('data-fetched', {
                    deviceName: item.deviceName,
                    memoryStart: item.start,
                    memoryAreaIndex: item.memoryAreaIndex,
                    quantity: item.quantity,
                    buffer: buffer
                })
                const oldBuff = this.readMemoryArea[item.memoryAreaIndex].buffer;
                for (let i = 0; i < item.quantity * 2; i++) {
                    oldBuff[i + item.bufferIndex * 2] = buffer[i];
                }
                this.readMemoryArea[item.memoryAreaIndex].buffer = oldBuff;
            } catch (error) {
                if (error.err === 'Timeout') {
                    this.status = ModbusClient.STATUS.TIMEOUT;
                    console.log("[modbus] timeout: " + new Date().toLocaleString())
                }
                console.log("dddd")
            }
        }

        this.isHolding = false;
    }
}

/*

let modbus_new = new ModbusClient({
    host: '192.168.0.20',
    port: '502',
    timeout: 1000,
    autoReconnect: true,
    loopDelay: 200,
    reconnectDelay: 1000,   // fixed 1 s between attempts,
    readMemoryArea: [
        { slaveID: 10, functionCode: 3, start: 0, size: 200 },
        { slaveID: 10, functionCode: 3, start: 200, size: 50 }
    ],
    maxReadSize: 125
})



modbus_new.on('error', (error) => console.log("[modbus1] error_detected: " + new Date().toLocaleString(), error))
modbus_new.on('connect', () => console.log("[modbus1] connected: " + new Date().toLocaleString()))
modbus_new.on('close', () => console.log("[modbus1] close: " + new Date().toLocaleString()))
modbus_new.on('connecting', () => console.log("[modbus1] connecting: " + new Date().toLocaleString()))
modbus_new.on('disconnect', () => console.log("[modbus1] disconnect: " + new Date().toLocaleString()))
modbus_new.on('reconnect', () => console.log("[modbus1] reconnect: " + new Date().toLocaleString()))
modbus_new.on('timeout', () => console.log("[modbus1] timeout: " + new Date().toLocaleString()))
modbus_new.on('warn', (message) => console.log("[modbus1] warn: " + new Date().toLocaleString(), message))

*/



export default ModbusClient;

// ── Device initialization ────────────────────────────────────────────────────
// Import the raw device config and attach a live ModbusClient to each entry.
// • Gateway devices (LOG001, LOG002): one TCP connection whose readMemoryArea
//   spans all RTU sub-devices, each with its own slaveID.
// • Direct TCP devices (PR001–PR014): one dedicated TCP connection per device.

import ModBusDevices from '../runtime/database.js';

ModBusDevices.forEach(device => {
    let readMemoryArea;

    if (device.RtuDevices) {
        // Multi-drop RS-485 gateway: flatten all sub-device areas into one list.
        readMemoryArea = device.RtuDevices.flatMap(rtu =>
            rtu.areas.map(area => ({
                deviceName: `${device.name}/${rtu.name}`,
                slaveID: rtu.slaveID,
                functionCode: area.fc,
                start: area.start,
                size: area.len
            }))
        );
    } else {
        // Direct Modbus TCP device.
        readMemoryArea = device.areas.map(area => ({
            deviceName: device.name,
            slaveID: device.slaveID,
            functionCode: area.fc,
            start: area.start,
            size: area.len
        }));
    }

    device.client = new ModbusClient({
        host: device.ip,
        port: parseInt(device.port),
        deviceName: device.name,
        readMemoryArea,
        loopDelay: 200,
        reconnectDelay: 3000,
        maxReconnectDelay: 3000,
        maxReadSize: 120
    });

    console.log(device.client.areaPartition())

    device.client.on('connect', () => console.log(`[${device.name}] connected`));
    //device.client.on('close', () => console.log(`[${device.name}] connection closed`));
    device.client.on('error', (err) => {
        //console.log(`[${device.name}] error:`, err.message)
    });
    device.client.on('data', (d) => {
        //console.log(device.name, ":", d)
    },)

    device.client.on('data-fetched', (e) => {
        console.log(e)
    })
    //device.client.on('timeout', () => console.log(`[${device.name}] timeout`));
    //device.client.on('reconnecting', ({ delay }) => console.log(`[${device.name}] reconnecting in ${delay}ms`));
});
