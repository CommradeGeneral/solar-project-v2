import { registeredSockets } from "../websocket/websocket.js";
import ModBusDevices from "../database.js";


setInterval(() => {
    registeredSockets.forEach((socket) => {
        socket.data.forEach((key) => {

            let buffer = ModBusDevices[key.deviceID[0]].devices[key.deviceID[1]].buff;
            if (buffer) {
                socket.socket.emit("data-exchange", {
                    ...key,
                    data: buffer.slice(key.startFrom, key.startFrom + key.length),
                })
            }
        })
    })
}, 100)