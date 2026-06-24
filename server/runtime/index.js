import { Server } from "socket.io";
import { Modbusdevices } from "./deviceMap.js";

const mysocket = new Server(8500, {
    cors: {
        origin: ["http://localhost:5173", "http://192.168.1.230:8000"],
        credentials: true
    }
});

mysocket.on("connection", (socket) => {
    console.log("User connected")
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

        data.forEach((item) => {
            console.log(data);
            Modbusdevices[item.deviceID].socketClients.set(socket.id, { socket: socket, startFrom: item.startFrom, len: item.length })
            socketDevices.push(item.deviceID)
        })
        socketDevices.forEach((deviceID) => {
            // just print socket id for each device
            console.log(`deviceID : ${deviceID} => `, Modbusdevices[deviceID].socketClients.keys())
        })

    })

    socket.on("disconnect", () => {
        console.log("User disconnected");
        //socketGrp.delete(item.deviceID);
        socketDevices.forEach((deviceID) => {
            Modbusdevices[deviceID].socketClients.delete(socket.id);
        })
        socketDevices.forEach((deviceID) => {
            // just print socket id for each device
            console.log(`deviceID : ${deviceID} => `, Modbusdevices[deviceID].socketClients.keys())
        })
        socketDevices = [];

    });
});


setInterval(() => {
    for (let mod of Object.keys(Modbusdevices)) {
        //console.log(mod)
        try {
            Modbusdevices[mod].buffer.writeInt16LE(Math.random() * 1000, 0)
            Modbusdevices[mod].socketClients.forEach((client) => {
                console.log(client)

            })
        } catch (error) {
        }
    }
}, 5000)



