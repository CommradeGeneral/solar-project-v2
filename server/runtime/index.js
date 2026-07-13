import { Server } from "socket.io";
import net from "net";

import "./websocket/websocket.js"








/*
const pipeClient = net.createConnection("\\\\.\\pipe\\runtime", () => {
    console.log("Connected to the IPC");
    pipeClient.write(JSON.stringify({ a: 1 }));
});

pipeClient.on("data", (data) => {
    console.log(data);
});

pipeClient.on("close", () => {
    console.log("Disconnected from the IPC");
});

pipeClient.on("error", (err) => {
    console.log(err);
});

pipeClient.on("connect", () => {
    console.log("Connected to the IPC");
});
*/