
/*let LOG001_devices = {
    "EM001": { name: "EM001", slaveID: 1, fc: 3, start: 0x0000, buff: Buffer.alloc(120), connectionStat: 0, penality: 0, socketClients: new Map() },
    "EM002": { name: "EM002", slaveID: 1, fc: 3, start: 0x0000, buff: Buffer.alloc(100), connectionStat: 0, penality: 0, socketClients: new Map() },
    "EM003": { name: "EM003", slaveID: 1, fc: 3, start: 0x0000, buff: Buffer.alloc(100), connectionStat: 0, penality: 0, socketClients: new Map() },
    "EM004": { name: "EM004", slaveID: 1, fc: 3, start: 0x0000, buff: Buffer.alloc(100), connectionStat: 0, penality: 0, socketClients: new Map() },
}
*/
let ModBusDevices = [
    {
        name: "LOG001",
        ip: "127.0.0.21",
        port: 502,
        type: "modbus",
        RtuDevices: [
            { name: "EM001", slaveID: 1, areas: [{ fc: 3, start: 9001, len: 60 }, { fc: 3, start: 9100, len: 60 }] },
            { name: "EM002", slaveID: 2, areas: [{ fc: 3, start: 9001, len: 60 }] },
            { name: "EM003", slaveID: 3, areas: [{ fc: 3, start: 9001, len: 60 }] },
            { name: "EM004", slaveID: 4, areas: [{ fc: 3, start: 9001, len: 60 }] },
        ]
    },
    {
        name: "LOG002",
        ip: "127.0.0.22",
        port: 502,
        type: "modbus",
        RtuDevices: [
            { name: "WS001", slaveID: 1, areas: [{ fc: 3, start: 0, len: 60 }] },
        ]
    },
    {
        name: "PR001",
        ip: "127.0.0.31",
        port: "502",
        slaveID: 1,
        areas: [
            { fc: 3, start: 128, len: 200 }
        ]
    },
    {
        name: "PR002",
        ip: "127.0.0.32",
        port: "502",
        slaveID: 1,
        areas: [
            { fc: 3, start: 128, len: 200 }
        ]
    },
    {
        name: "PR003",
        ip: "127.0.0.33",
        port: "502",
        slaveID: 1,
        areas: [
            { fc: 3, start: 128, len: 200 }
        ]
    },
    {
        name: "PR004",
        ip: "127.0.0.34",
        port: "502",
        slaveID: 1,
        areas: [
            { fc: 3, start: 128, len: 200 }
        ]
    },
    {
        name: "PR005",
        ip: "127.0.0.35",
        port: "502",
        slaveID: 1,
        areas: [
            { fc: 3, start: 128, len: 200 }
        ]
    },
    {
        name: "PR006",
        ip: "127.0.0.36",
        port: "502",
        slaveID: 1,
        areas: [
            { fc: 3, start: 128, len: 200 }
        ]
    },
    {
        name: "PR007",
        ip: "127.0.0.37",
        port: "502",
        slaveID: 1,
        areas: [
            { fc: 3, start: 128, len: 200 }
        ]
    },
    {
        name: "PR008",
        ip: "127.0.0.38",
        port: "502",
        slaveID: 1,
        areas: [
            { fc: 3, start: 128, len: 200 }
        ]
    },
    {
        name: "PR009",
        ip: "127.0.0.39",
        port: "502",
        slaveID: 1,
        areas: [
            { fc: 3, start: 128, len: 200 }
        ]
    },
    {
        name: "PR010",
        ip: "127.0.0.40",
        port: "502",
        slaveID: 1,
        areas: [
            { fc: 3, start: 128, len: 200 }
        ]
    },
    {
        name: "PR011",
        ip: "127.0.0.41",
        port: "502",
        slaveID: 1,
        areas: [
            { fc: 3, start: 128, len: 200 }
        ]
    },
    {
        name: "PR012",
        ip: "127.0.0.42",
        port: "502",
        slaveID: 1,
        areas: [
            { fc: 3, start: 128, len: 200 }
        ]
    },
    {
        name: "PR013",
        ip: "127.0.0.43",
        port: "502",
        slaveID: 1,
        areas: [
            { fc: 3, start: 128, len: 200 }
        ]
    },
    {
        name: "PR014",
        ip: "127.0.0.44",
        port: "502",
        slaveID: 1,
        areas: [
            { fc: 3, start: 128, len: 200 }
        ]
    }
]

export default ModBusDevices;