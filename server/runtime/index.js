import { Server } from "socket.io";
import { fork } from "child_process";
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

import ModBusDevices from "./database.js";


const mysocket = new Server(3000, {
    cors: {
        origin: ["http://localhost:5173", "http://192.168.100.13:8000",],
        credentials: true
    }
});


mysocket.on("connection", (socket) => {
    let currentPage = 0;
    let interval = null;
    let socketDevices = [];
    let last_data = null;

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
        //console.log(socket.id, `=>`, data)
        console.log(socket.id, 'ModBusDevices[logger].devices[device]')
        // first: clear socket from all modbus 
        Object.values(ModBusDevices).forEach(item => {
            Object.values(item.devices).forEach(device => {
                device.socketClients.delete(socket.id);
            })
        })
        last_data = data;
        if (data == null) return;
        data.forEach((item) => {
            let { deviceID, startFrom, length } = item;
            if (deviceID == null) return;
            let logger = deviceID[0];
            let device = deviceID[1];
            //console.log(ModBusDevices[logger].devices[device]);
            let obj = ModBusDevices[logger].devices[device];
            //console.log("Line 1: ", obj.socketClients);
            obj.socketClients.set(socket.id, {
                socket: socket,
                id: socket.id,
                startFrom: startFrom,
                length: length
            });
            // add socket to map 

            socketDevices.push(deviceID);
        })



        /*Object.values(ModBusDevices).forEach(item => {
            Object.values(item.devices).forEach(device => {
                console.log(device.name, ':\t')
                for (let socketClients of device.socketClients.values()) {
                    console.log('\tID:', socketClients.id);
                    console.log('\tstartFrom:', socketClients.startFrom);
                    console.log('\tlength:', socketClients.length);
                    // if not last, print , 
                    if (socketClients.id !== device.socketClients.values().next().value.id) {
                        console.log('\t----------------------------------------------');
                    }
                }
            })
        })*/


    })
    if (last_data != null) {
        socket.emit("refresh", last_data);
    }

    socket.on("disconnect", () => {
        console.log("User disconnected");
        socketDevices.forEach((deviceID) => {
            let logger = deviceID[0];
            let device = deviceID[1];
            ModBusDevices[logger].devices[device].socketClients.delete(socket.id);
        })
    });
});


setInterval(() => {
    Object.keys(ModBusDevices).forEach(key => {
        Object.keys(ModBusDevices[key].devices).forEach(device => {
            // generate fake data
            let deviceData = ModBusDevices[key].devices[device];
            let buff = deviceData.buff;
            for (let i = 0; i < buff.length; i++) {
                buff[i] = Math.floor(Math.random() * 0x10000);
            }
            //console.log({ key, device })
            // send the whole buffer to another service via IPC


            // loop on available sockets
            ModBusDevices[key].devices[device].socketClients.values().forEach((socketObject) => {
                //console.log(ModBusDevices[key].devices[device].socketClients)
                let startFrom = socketObject.startFrom;
                let length = socketObject.length;
                let data = buff.slice(startFrom, startFrom + length);
                console.log({ id: socketObject.id, startFrom: startFrom, length: length, deviceID: [key, device], buff: buff })
                /*console.log({
                    deviceID: [key, device],
                    buff: data,
                    startFrom: startFrom,
                    length: length
                })*/
                socketObject.socket.emit("data-exchange", {
                    deviceID: [key, device],
                    buff: data,
                    startFrom: startFrom,
                    length: length
                })


            })
        })
    })
}, 100);








