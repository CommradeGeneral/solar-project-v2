/*let LOG001_devices = {
    "EM001": { name: "EM001", slaveID: 1, fc: 3, start: 0x0000, buff: Buffer.alloc(120), connectionStat: 0, penality: 0, socketClients: new Map() },
    "EM002": { name: "EM002", slaveID: 1, fc: 3, start: 0x0000, buff: Buffer.alloc(100), connectionStat: 0, penality: 0, socketClients: new Map() },
    "EM003": { name: "EM003", slaveID: 1, fc: 3, start: 0x0000, buff: Buffer.alloc(100), connectionStat: 0, penality: 0, socketClients: new Map() },
    "EM004": { name: "EM004", slaveID: 1, fc: 3, start: 0x0000, buff: Buffer.alloc(100), connectionStat: 0, penality: 0, socketClients: new Map() },
}
*/
let ModBusDevices = {
    "LOG001": {
        name: "LOG001",
        ip: "[IP_ADDRESS]",
        port: 502,
        type: "modbus",
        devices: {
            "EM001": { name: "EM001", slaveID: 1, fc: 3, start: 0x0000, buff: new Uint16Array(120), connectionStat: 0, penality: 0, socketClients: new Map() },
            "EM002": { name: "EM002", slaveID: 2, fc: 3, start: 0x0000, buff: new Uint16Array(100), connectionStat: 0, penality: 0, socketClients: new Map() },
            "EM003": { name: "EM003", slaveID: 3, fc: 3, start: 0x0000, buff: new Uint16Array(100), connectionStat: 0, penality: 0, socketClients: new Map() },
            "EM004": { name: "EM004", slaveID: 4, fc: 3, start: 0x0000, buff: new Uint16Array(100), connectionStat: 0, penality: 0, socketClients: new Map() },
        }
    },
    "LOG002": {
        name: "LOG002",
        ip: "[IP_ADDRESS]",
        port: 502,
        type: "modbus",
        devices: {
            "WS001": { name: "WS001", slaveID: 1, fc: 3, start: 0x0000, buff: new Uint16Array(120), connectionStat: 0, penality: 0, socketClients: new Map() },
        }
    },
    "PR001": {
        name: "PR001",
        ip: "[IP_ADDRESS]",
        port: 502,
        type: "modbus",
        devices: {
            "PR001": { name: "PR001", slaveID: 1, fc: 3, start: 0x0000, buff: new Uint16Array(120), connectionStat: 0, penality: 0, socketClients: new Map() },
        }
    },
    "PR002": {
        name: "PR002",
        ip: "[IP_ADDRESS]",
        port: 502,
        type: "modbus",
        devices: {
            "PR002": { name: "PR001", slaveID: 1, fc: 3, start: 0x0000, buff: new Uint16Array(120), connectionStat: 0, penality: 0, socketClients: new Map() },
        }
    },
    // to PR014
    "PR003": {
        name: "PR003",
        ip: "[IP_ADDRESS]",
        port: 502,
        type: "modbus",
        devices: {
            "PR003": { name: "PR001", slaveID: 1, fc: 3, start: 0x0000, buff: new Uint16Array(120), connectionStat: 0, penality: 0, socketClients: new Map() },
        }
    },
    "PR004": {
        name: "PR004",
        ip: "[IP_ADDRESS]",
        port: 502,
        type: "modbus",
        devices: {
            "PR004": { name: "PR001", slaveID: 1, fc: 3, start: 0x0000, buff: new Uint16Array(120), connectionStat: 0, penality: 0, socketClients: new Map() },
        }
    },
    "PR005": {
        name: "PR005",
        ip: "[IP_ADDRESS]",
        port: 502,
        type: "modbus",
        devices: {
            "PR005": { name: "PR001", slaveID: 1, fc: 3, start: 0x0000, buff: new Uint16Array(120), connectionStat: 0, penality: 0, socketClients: new Map() },
        }
    },
    "PR006": {
        name: "PR006",
        ip: "[IP_ADDRESS]",
        port: 502,
        type: "modbus",
        devices: {
            "PR006": { name: "PR001", slaveID: 1, fc: 3, start: 0x0000, buff: new Uint16Array(120), connectionStat: 0, penality: 0, socketClients: new Map() },
        }
    },
    "PR007": {
        name: "PR007",
        ip: "[IP_ADDRESS]",
        port: 502,
        type: "modbus",
        devices: {
            "PR007": { name: "PR001", slaveID: 1, fc: 3, start: 0x0000, buff: new Uint16Array(120), connectionStat: 0, penality: 0, socketClients: new Map() },
        }
    },
    "PR008": {
        name: "PR008",
        ip: "[IP_ADDRESS]",
        port: 502,
        type: "modbus",
        devices: {
            "PR008": { name: "PR001", slaveID: 1, fc: 3, start: 0x0000, buff: new Uint16Array(120), connectionStat: 0, penality: 0, socketClients: new Map() },
        }
    },
    "PR009": {
        name: "PR009",
        ip: "[IP_ADDRESS]",
        port: 502,
        type: "modbus",
        devices: {
            "PR009": { name: "PR001", slaveID: 1, fc: 3, start: 0x0000, buff: new Uint16Array(120), connectionStat: 0, penality: 0, socketClients: new Map() },
        }
    },
    "PR010": {
        name: "PR010",
        ip: "[IP_ADDRESS]",
        port: 502,
        type: "modbus",
        devices: {
            "PR010": { name: "PR001", slaveID: 1, fc: 3, start: 0x0000, buff: new Uint16Array(120), connectionStat: 0, penality: 0, socketClients: new Map() },
        }
    },
    "PR011": {
        name: "PR011",
        ip: "[IP_ADDRESS]",
        port: 502,
        type: "modbus",
        devices: {
            "PR011": { name: "PR001", slaveID: 1, fc: 3, start: 0x0000, buff: new Uint16Array(120), connectionStat: 0, penality: 0, socketClients: new Map() },
        }
    },
    "PR012": {
        name: "PR012",
        ip: "[IP_ADDRESS]",
        port: 502,
        type: "modbus",
        devices: {
            "PR012": { name: "PR001", slaveID: 1, fc: 3, start: 0x0000, buff: new Uint16Array(120), connectionStat: 0, penality: 0, socketClients: new Map() },
        }
    },
    "PR013": {
        name: "PR013",
        ip: "[IP_ADDRESS]",
        port: 502,
        type: "modbus",
        devices: {
            "PR013": { name: "PR001", slaveID: 1, fc: 3, start: 0x0000, buff: new Uint16Array(120), connectionStat: 0, penality: 0, socketClients: new Map() },
        }
    },
    "PR014": {
        name: "PR014",
        ip: "[IP_ADDRESS]",
        port: 502,
        type: "modbus",
        devices: {
            "PR014": { name: "PR001", slaveID: 1, fc: 3, start: 0x0000, buff: new Uint16Array(120), connectionStat: 0, penality: 0, socketClients: new Map() },
        }
    }
}

export default ModBusDevices;