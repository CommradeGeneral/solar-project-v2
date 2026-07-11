import { Router } from 'express'
import { fileURLToPath } from 'url';
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const mainPageRouter = Router()

mainPageRouter.get("/favicon.svg", (req, res) => {
    res.sendFile(path.join(__dirname, "../../../client/dist/favicon.svg"));
});

mainPageRouter.get("/unjustking.svg", (req, res) => {
    res.sendFile(path.join(__dirname, "../../../client/dist/unjustking.svg"));
});



//app.use(express.static(path.join(__dirname, "../../client/dist")));
mainPageRouter.get("/", (req, res, next) => {
    res.redirect("main/control-panel")
    next()
});
// /assets/*
mainPageRouter.get(/^\/assets\/.*$/, (req, res) => {
    let url = req.url.replace(/^\/assets\//, '');
    console.log(url)
    res.sendFile(path.join(__dirname, "../../../client/dist/assets/" + url));
})
//app.use(express.static(path.join(__dirname, "../../client/dist/favicon.svg")));

mainPageRouter.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, "../../../client/dist/index.html"));
})



export default mainPageRouter