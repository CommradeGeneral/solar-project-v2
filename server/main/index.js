import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { Router } from "express";
import favicon from "serve-favicon";
import { join } from "path";
import { fork } from "child_process";
import mainPageRouter from "./routers/mainPage.js";
import loginRouter from "./routers/login.js";
import connect from "./database/database.js";
import cookieParser from "cookie-parser";
import authenticationRouter from "./routers/authentications.js";
import authController from "./controllers/authentrication.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let config = fs.readFileSync(join(__dirname, '../config.json'));
config = JSON.parse(config);
const { ip, socketPort, webServerPort } = config.network;

const app = express();
const router = Router();

app.use(cors({
    origin: ["http://localhost:5173", `http://${ip}${webServerPort == 80 ? '' : ':' + webServerPort}`],
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use("/main", mainPageRouter);
app.use("/login", loginRouter);

app.use("/api", authenticationRouter);



app.get("/gloriousFiles/network.svg", (req, res) => {
    let svgContnet = fs.readFileSync(path.join(__dirname, "../../client/src/assets/network.svg"));
    //console.log(svgContnet)
    res.writeHead(200, { "Content-Type": "image/svg+xml" });
    res.end(svgContnet);
    //res.send("dsdsds")
});

app.get("/blab", (req, res) => {
    setTimeout(() => {
        res.send("Hello World");
    }, 10000);
});





app.get("/", (req, res) => {
    res.redirect(302, "/login")
})


app.get(/(.*)/, (req, res) => {
    res.status(404).send("Not Found");
    res.end();
})





connect().then(() => {
    app.listen(webServerPort, ip, () => {
        console.log("Server started on port", webServerPort);

    });
}).catch(err => console.log(err));

// run modbus process
const runtimeProcess = fork(join(__dirname, "../runtime/index.js"));

runtimeProcess.on("message", (data) => {
    //cnsole.log(data);
});