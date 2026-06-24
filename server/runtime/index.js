import { Server } from "socket.io";

const mysocket = new Server(3000, {
    cors: {
        origin: ["http://localhost:5173", "http://192.168.100.13:8000",],
        credentials: true
    }
});

let socketGrp = new Map();

mysocket.on("connection", (socket) => {
    let currentPage = 0;
    let interval = null;
    let socketDevices = [];
    socket.on("page", (data) => {
        /**
         * data [j] = {
         *  deviceID: "EM001",
         *  startFrom: n
         *  length: len
         * }
         * 
         * Modbusdevices[deviceID].socketClients.set(socket.id, {socket: socket, startFrom: n len: len})
         * socketDevices.push(deviceID)
         */
        console.log(data)
        data.forEach((item) => {
            Modbusdevices[item.deviceID].socketClients.set(socket.id, { socket: socket, startFrom: item.startFrom, len: item.length })
            socketDevices.push(item.deviceID)
        })
        console.log(Modbusdevices)
    })

    socket.on("disconnect", () => {
        console.log("User disconnected");
        //socketGrp.delete(socket.id);
        console.log(socketGrp);
        socketDevices.forEach((deviceID) => {
            Modbusdevices[deviceID].socketClients.delete(socket.id);
        })

    });
});

/*
socket_client = {
    socket: socket_x,
    socketID: socketID
    start: xx
    len: xxxx
}

*/
let Modbusdevices = {
    "EM001": { logger: "logger-1", slaveID: 1, fc: 3, start: 0x0000, buff: Buffer.alloc(120), connectionStat: 0, penality: 0, socketClients: new Map() },
    "EM002": { logger: "logger-1", slaveID: 1, fc: 3, start: 0x0000, buff: Buffer.alloc(100), connectionStat: 0, penality: 0, socketClients: new Map() },
    "EM003": { logger: "logger-1", slaveID: 1, fc: 3, start: 0x0000, buff: Buffer.alloc(100), connectionStat: 0, penality: 0, socketClients: new Map() },
    "EM004": { logger: "logger-1", slaveID: 1, fc: 3, start: 0x0000, buff: Buffer.alloc(100), connectionStat: 0, penality: 0, socketClients: new Map() },
}

setInterval(() => {
    let sockets = Modbusdevices["EM001"].socketClients.values();
    console.log(sockets);
    let buff = Modbusdevices["EM001"].buff.map((item) => Math.floor(Math.random() * 256));
    console.log(buff);
    sockets.forEach((item) => {
        if (item.socket != null) {
            socket.emit("data-exchange", { start: item.startFrom, len: length, buff: buff.subarray(item.start, 3) })
        }
    })
}, 1000)






