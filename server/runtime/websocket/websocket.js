import { Server } from "socket.io";
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import fs from 'fs';

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
    console.log("new client connected");
    socket.emit("data-exchange")
    socket.on("page", (data) => {
        registeredSockets.push({
            id: socket.id,
            //socket: socket,
            data: data
        })
        console.log(registeredSockets);
    })
    socket.on("disconnect", () => {
        registeredSockets = registeredSockets.filter((item) => item.id !== socket.id);
        console.log("client disconnected");
        console.log(registeredSockets);
    });
});

export { registeredSockets, mysocket }