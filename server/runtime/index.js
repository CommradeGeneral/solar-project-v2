import { Server } from "socket.io";
import ModbusClient from "./connections/modbus.js";

const mysocket = new Server(3000, {
    cors: {
        origin: ["http://localhost:5173", "http://192.168.100.13:8000",],
        credentials: true
    }
});

let kingsocket = null;

mysocket.on("connection", (socket) => {
    console.log("A user connected");
    kingsocket = socket;

    socket.on("page", (data) => {
        console.log(data);
    })
    let time = Date.now()
    let val = setInterval(() => {
        if (socket !== null) {
            let buff = Buffer.alloc(50000);
            buff.forEach((_, i) => {
                buff[i] = Math.floor(Math.random() * 255);
            });
            socket.emit("data-exchange", { id: socket.id, nigga: buff, wait: Date.now() - time, timestamp: Date.now() });
        }
        time = Date.now()
    }, 100);

    /*


    */
    socket.on("disconnect", () => {
        console.log("User disconnected");
        clearInterval(val);
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

