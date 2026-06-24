let Modbusdevices = {
    "EM001": {
        loggerID: "L001",
        slaveID: 1,
        fc: 3,
        startAddress: 0,
        buffer: Buffer.alloc(200, Uint16Array),
        socketClients: new Map()
    },
    "EM002": {
        loggerID: "L001",
        slaveID: 2,
        fc: 3,
        startAddress: 0,
        buffer: Buffer.alloc(200, Uint16Array),
        socketClients: new Map()
    },
    "EM003": {
        loggerID: "L001",
        slaveID: 3,
        fc: 3,
        startAddress: 0,
        buffer: Buffer.alloc(200, Uint16Array),
        socketClients: new Map()
    },
    "EM004": {
        loggerID: "L001",
        slaveID: 4,
        fc: 3,
        startAddress: 0,
        buffer: Buffer.alloc(200, Uint16Array),
        socketClients: new Map()
    },
    "EM005": {
        loggerID: "L001",
        slaveID: 5,
        fc: 3,
        startAddress: 0,
        buffer: Buffer.alloc(200, Uint16Array),
        socketClients: new Map()
    },
    "EM006": {
        loggerID: "L001",
        slaveID: 6,
        fc: 3,
        startAddress: 0,
        buffer: Buffer.alloc(200, Uint16Array),
        socketClients: new Map()
    },
    "EM007": {
        loggerID: "L001",
        slaveID: 7,
        fc: 3,
        startAddress: 0,
        buffer: Buffer.alloc(200, Uint16Array),
        socketClients: new Map()
    },
    "EM008": {
        loggerID: "L001",
        slaveID: 8,
        fc: 3,
        startAddress: 0,
        buffer: Buffer.alloc(200, Uint16Array),
        socketClients: new Map()
    },
    "EM009": {
        loggerID: "L001",
        slaveID: 9,
        fc: 3,
        startAddress: 0,
        buffer: Buffer.alloc(200, Uint16Array),
        socketClients: new Map()
    },
    "EM010": {
        loggerID: "L001",
        slaveID: 10,
        fc: 3,
        startAddress: 0,
        buffer: Buffer.alloc(200, Uint16Array),
        socketClients: new Map()
    },
    "EM011": {
        loggerID: "L001",
        slaveID: 11,
        fc: 3,
        startAddress: 0,
        buffer: Buffer.alloc(200, Uint16Array),
        socketClients: new Map()
    },
    "EM012": {
        loggerID: "L001",
        slaveID: 12,
        fc: 3,
        startAddress: 0,
        buffer: Buffer.alloc(200, Uint16Array),
        socketClients: new Map()
    },
    "L001": {
        ip: "192.168.1.5",
        port: 502
    },
    "WS001": {
        loggerID: "L002",
        slaveID: 1,
        fc: 3,
        startAddress: 0,
        buffer: Buffer.alloc(200, Uint16Array),
        socketClients: new Map()
    },
    "L002": {
        ip: "192.168.1.6",
        port: 502
    },
    "PR001": {
        ip: "192.168.1.7",
        port: 502,
        logger: null,
        slaveID: 1,
        fc: 3,
        startAddress: 0,
        buffer: Buffer.alloc(200, Uint16Array),
        socketClients: new Map()
    },
    "PR002": {
        ip: "192.168.1.7",
        port: 502,
        logger: null,
        slaveID: 1,
        fc: 3,
        startAddress: 0,
        buffer: Buffer.alloc(200, Uint16Array),
        socketClients: new Map()
    }
}

export { Modbusdevices }