import { Router } from 'express'
import { fileURLToPath } from 'url';
import path from "path";
import authController from '../controllers/authentrication.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const authenticationRouter = Router()

authenticationRouter.route("/register").post(authController.register)
authenticationRouter.route("/login").post(authController.login)
authenticationRouter.route("/logout").get(authController.logout).post(authController.logout)

export default authenticationRouter
