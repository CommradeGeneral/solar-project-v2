import { Server } from "socket.io";

const mysocket = new Server(8500, {
    cors: {
        origin: ["http://localhost:5173", "http://192.168.1.230:8000"],
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



const kingsmodbus = new ModbusClient({
    protocol: "tcp",
    ip: "127.0.0.2",
    port: 502,
    slaveId: 2,
    timeout: 1000,
    baudrate: 9600,
    databits: 8,
    parity: "none",
    stopbits: 1,
});


kingsmodbus.client.on('close', () => {
    console.log("Modbus disconnected");
    kingsmodbus.connect();

})

kingsmodbus.client.on('error', (error) => {
    console.log("Modbus error", error);
})

