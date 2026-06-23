import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { Router } from "express";
import favicon from "serve-favicon";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const router = Router();

app.get("/favicon.svg", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/dist/favicon.svg"));
});

app.use(express.static(path.join(__dirname, "../../client/dist")));

//app.use(express.static(path.join(__dirname, "../../client/dist/favicon.svg")));

router.route("/").get((req, res) => {
    res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});


app.use("/main", router);

app.listen(8000, "192.168.1.230", () => {
    console.log("Server started on port 5050");
});