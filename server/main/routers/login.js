import { Router } from 'express'
import { fileURLToPath } from 'url';
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const loginRouter = Router()


// /assets/*
loginRouter.get(/^\/assets\/.*$/, (req, res) => {
    let url = req.url.replace(/^\/assets\//, '');
    //console.log(url)
    res.sendFile(path.join(__dirname, "../../../client-login/dist/assets/" + url));
})
//app.use(express.static(path.join(__dirname, "../../client/dist/favicon.svg")));

loginRouter.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, "../../../client-login/dist/index.html"));
})


export default loginRouter