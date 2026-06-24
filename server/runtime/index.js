import { Server } from "socket.io";

const mysocket = new Server(8500, {
    cors: {
        origin: ["http://localhost:5173", "http://192.168.1.230:8000"],
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


