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
                unitId: item.slaveID
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

        this._socket.on('connect', () => {
            this._connected = true;
            this.status = ModbusClient.STATUS.CONNECTED;
            this.loopTimer = setInterval(() => {
                this.readingLoop()
            }, this._loopDelay);
            this.emit('connect');
        });

        this._socket.on('data', (data) => this.emit('data', data));

        this._socket.on('error', (err) => {
            // Suppress ECONNRESET / EPIPE noise after we've already scheduled a reconnect
            this.status = ModbusClient.STATUS.ERROR;
            clearInterval(this.loopTimer);
            console.log("dddd")
            this.emit('error', err);
        });

        this._socket.on('timeout', () => {
            this.status = ModbusClient.STATUS.TIMEOUT;
            this.emit('timeout')
        });

        this._socket.on('close', (hadError) => {
            this._connected = false;
            this.status = ModbusClient.STATUS.CLOSED;
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
            this.status = ModbusClient.STATUS.CONNECTING;
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
                list.push({
                    unitId: item.unitId,
                    memoryAreaIndex: index,
                    start: item.start + accumlatedSize,
                    functionCode: item.functionCode,
                    quantity: Math.min(this.maxReadSize, item.quantity - accumlatedSize),
                    bufferIndex: accumlatedSize
                });
                accumlatedSize += Math.min(this.maxReadSize, item.quantity)

            }
        });
        return list;
    }

    async readingLoop() {
        if (this.isBusy() || this.status == ModbusClient.STATUS.ERROR) {
            return
        }
        let chunks = this.areaPartition();
        chunks.forEach(async (item) => {
            this.setSlaveId(item.unitId);
            await this._client.readHoldingRegisters(item.start, item.quantity).then(
                (response) => {
                    this.status = ModbusClient.STATUS.CONNECTED
                    let buffer = response.response.body.valuesAsBuffer
                    // overwrite readMemoryArea
                    let oldBuff = this.readMemoryArea[item.memoryAreaIndex].buffer;
                    // copy buffer to oldBuff given index start of oldBuff
                    for (let i = 0; i < item.quantity * 2; i++) {
                        oldBuff[i + item.bufferIndex * 2] = buffer[i]
                    }
                    this.readMemoryArea[item.memoryAreaIndex].buffer = oldBuff
                    //console.log("-------------------------------------------------------")
                    //console.log("Incomming Buffer:", buffer)
                    //console.log("buffer start from " + item.bufferIndex + " length: " + item.byteSize, this.readMemoryArea[item.memoryAreaIndex].buffer)
                }
            ).catch(
                (error) => {
                    if (error.err == 'Timeout') {
                        this.status = ModbusClient.STATUS.TIMEOUT
                    }

                    return;
                    //console.log(error);
                }
            )
        })



    }




}



let devices = []

devices.push(
    new ModbusClient({
        host: '192.168.0.20',
        port: '502',
        timeout: 1000,
        autoReconnect: true,
        loopDelay: 100,
        reconnectDelay: 1000,   // fixed 1 s between attempts,
        readMemoryArea: [
            { slaveID: 10, functionCode: 3, start: 0, size: 150 },
            { slaveID: 10, functionCode: 3, start: 100, size: 200 }
        ],
        maxReadSize: 13
    })
);

console.log(devices[0].areaPartition())


ModbusClient.ALL_DEVICES.forEach((dev) => {
    dev.on('error', (error) => console.log("error_detected", error))
})

/*   CONNECTED: 0,
        NON_INITIALIZED: 1,
        DISCONNECTED: 2,
        CONNECTING: 3,
        ERROR: 4,
        CLOSED: 5
    }*/

const statusToStr = {
    0: 'CONNECTED',
    1: 'NOT INITIALIZED',
    2: 'DISCONNECTED',
    3: 'CONNECTING',
    4: 'ERROR',
    5: 'CLOSED',
    6: 'TIMEOUT'
}
let oldStatus

setInterval(() => {
    console.log("-------===================")
    ModbusClient.ALL_DEVICES.forEach((dev, i) => {
        console.log("[modbus] device " + `${(i + 1).toString().padStart(2, '0')}` + " is", statusToStr[dev.status])
        console.log(dev.readMemoryArea.map(item => {
            return `start: ${item.start}, functionCode: ${item.functionCode}, size: ${item.quantity}, unitId: ${item.unitId}, buffer: ${Array.from(item.buffer)}}`
        }))
    })
    console.log("-------===================")
}, 1000)

export default ModbusClient;
