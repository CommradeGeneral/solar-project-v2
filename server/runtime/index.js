import { Server } from "socket.io";

const mysocket = new Server(3000, {
    cors: {
        origin: ["http://localhost:5173", "http://192.168.100.13:8000",],
        credentials: true
    }
});

let kingsocket = null;

let myFunctions = null;

mysocket.on("connection", (socket) => {
    console.log("A user connected");
    kingsocket = socket;

    socket.on("page", (data) => {
        console.log(data);
        // show all socket
    })

    // define function such that when called, it emits data to all clients
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

myFunctions = (u) => {
    mysocket.emit("data-exchange", { date: new Date(), data: u });
};


setInterval(() => {
    if (myFunctions !== null) {
        myFunctions("Hello from server");
        console.log("sent");
    }
}, 1000);


