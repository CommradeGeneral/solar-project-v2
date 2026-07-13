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
import usersRouter from "./routers/users.js";
import jwt from "jsonwebtoken";
import net from "net";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_access_token";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "super_secret_refresh_token";

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
app.use(cookieParser());

// Authentication middleware to check JWT validity
const checkAuth = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    let isValid = false;
    if (accessToken) {
        try {
            const decoded = jwt.verify(accessToken, JWT_SECRET);
            req.user = decoded;
            isValid = true;
        } catch (e) {
            isValid = false;
        }
    }

    // If access token is expired/missing, try to use refresh token
    if (!isValid) {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            try {
                const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

                // Refresh token is valid! Generate a new access token
                const newAccessToken = jwt.sign(
                    { username: decoded.username, role: decoded.role },
                    JWT_SECRET,
                    { expiresIn: "1m" }
                );

                res.cookie("accessToken", newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 60 * 1000 // 1 minute
                });

                req.user = { username: decoded.username, role: decoded.role };
                isValid = true;
            } catch (e) {
                isValid = false; // Refresh token also invalid
            }
        }
    }

    req.isAuthenticated = isValid;
    next();
};

app.use(checkAuth);

app.use("/main", (req, res, next) => {
    if (!req.isAuthenticated) {
        return res.redirect(302, "/login");
    }
    next();
}, mainPageRouter);

app.use("/login", (req, res, next) => {
    // Let authenticated users bypass the login page
    if (req.isAuthenticated) {
        return res.redirect(302, "/main");
    }
    next();
}, loginRouter);

app.use("/api", authenticationRouter);
app.use("/api/users", usersRouter);



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
    if (req.isAuthenticated) {
        res.redirect(302, "/main");
    } else {
        res.redirect(302, "/login");
    }
});


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
/*
const runtimeProcess = fork(join(__dirname, "../runtime/index.js"));

runtimeProcess.on("message", (data) => {
    console.log(data);
});
*/

// interprocessing communication

const server = net.createServer((socket) => {
    console.log("Client connected");
    socket.on("data", (data) => {
        console.log(JSON.parse(data));
    });
    socket.on("close", () => {
        console.log("Client disconnected");
    });
});
server.listen("\\\\.\\pipe\\runtime", () => {
    console.log("Server started to the IPC");
});
