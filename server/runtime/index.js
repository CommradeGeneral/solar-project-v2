import { Server } from "socket.io";

const mysocket = new Server(3000, {
    cors: {
        origin: ["http://localhost:5173", "http://192.168.100.13:8000",],
        credentials: true
    }
});

mysocket.on("connection", (socket) => {
    socket.on("page", (data) => {
        let val = { ...socket, state: { page: data.page } }
        console.log(val.state.page)
    })

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});





