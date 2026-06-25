import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { Router } from "express";
import favicon from "serve-favicon";
import { join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let config = fs.readFileSync(join(__dirname, '../config.json'));
config = JSON.parse(config);
const { ip, socketPort, webServerPort } = config.netwotk;

const app = express();
const router = Router();

app.use(cors({
    origin: ["http://localhost:5173", `http://${ip}:${webServerPort}`],
    credentials: true
}))

app.get("/favicon.svg", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/dist/favicon.svg"));
});

app.get("/unjustking.svg", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/dist/unjustking.svg"));
});

app.use(express.static(path.join(__dirname, "../../client/dist")));

//app.use(express.static(path.join(__dirname, "../../client/dist/favicon.svg")));

router.route("/").get((req, res) => {
    res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});



app.use("/main", router);

app.get("/blab", (req, res) => {
    setTimeout(() => {
        res.send("Hello World");
    }, 10000);
});

app.get("/", (req, res) => {
    console.log(req.headers.get('sec-fetch-site'));
});

app.listen(webServerPort, ip, () => {
    console.log("Server started on port", webServerPort);
});

process.on('message', (data) => {
    console.log('--->')
})