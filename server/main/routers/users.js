import { Router } from "express";
import usersController from "../controllers/users.js";

const usersRouter = Router();

usersRouter.get("/", usersController.getUsers);
usersRouter.post("/", usersController.addUser);
usersRouter.delete("/:username", usersController.deleteUser);

export default usersRouter;
