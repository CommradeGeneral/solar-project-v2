import { Server } from "socket.io";
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import fs from 'fs';
import ModbusDevices from "../database.js";
import ModbusClient from "../../connections/modbus.js";

let registeredSockets = [];
const __dirname = dirname(fileURLToPath(import.meta.url));
let config = fs.readFileSync(join(__dirname, '../../config.json'));
config = JSON.parse(config);


const { ip, socketPort, webServerPort } = config.network;


const mysocket = new Server(socketPort, {
    cors: {
        origin: ["http://localhost:5173", `http://${ip}${webServerPort != 80 ? ':' + webServerPort : ''}`],
        credentials: true
    }
});


mysocket.on("connection", (socket) => {
    console.log(socket.handshake.headers)
    console.log("new client connected");
    registeredSockets.push({
        id: socket.id,
        socket: socket,
        data: null,
        devices: null,
    })
    console.log("total sockets", registeredSockets.length)

    socket.emit("data-exchange")
    socket.on("page", (data) => {
        registeredSockets = registeredSockets.map((item) => item.id === socket.id ? { ...item, devices: data } : item)
        let current_data = registeredSockets.filter((item) => item.id === socket.id)
        let devices = []
        current_data.map((item) => {
            devices = devices.concat(...item.devices.map((item) => item.devices))
        })
        // merging devices based on database.js
        // listing all possible devices in all partition 
        let partitionedDevices = [];
        ModbusClient.ALL_DEVICES.forEach((device) => {
            partitionedDevices = partitionedDevices.concat(device.areaPartition());
        })

        let neededDevices = [];

        // filter devices
        devices.forEach((device) => {
            partitionedDevices.forEach((partitionedDevice) => {
                if (device.deviceID === partitionedDevice.deviceName) {
                    neededDevices.push(partitionedDevice);
                }
            })
        })
        console.log("neededDevices", neededDevices)


    })
    socket.on("disconnect", () => {
        console.log("disconnec");
        registeredSockets = registeredSockets.filter((item) => item.id !== socket.id);
        // destroy socker
        console.log("client disconnected");
    });
});

function printData(arr) {
    console.log("==============")
    arr.map(
        (item, index) => {
            console.log(`socketId: ${item.id} socketData: ${item.data}`)
        }
    )
    console.log("==============")
}

// graceful shut sockets down

process.on("SIGINT", () => {
    console.log("SIGINT received, shutting down gracefully");
    registeredSockets.map((item) => item.socket.disconnect());
    mysocket.close();
    process.exit(0)
});


export { registeredSockets, mysocket }