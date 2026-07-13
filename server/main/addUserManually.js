import connect from "./database/database.js";
import userController from "./controllers/users.js";
connect().then(() => {
    console.log("Connected to database");
    userController.addUserManually("admin", "1234", "admin");
}).catch(err => console.log(err));
