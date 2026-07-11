import sql from "mssql/msnodesqlv8.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: "Please provide username and password" });
        return;
    }
    // chech if username already exist
    const { recordset: users } = await sql.query`SELECT * FROM users WHERE username = ${username}`;
    if (users.length > 0) {
        //res.status(400).json({ message: "Username already exists" });
        console.log("Username already exists")
        return;
    }



    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword.length);
    await sql.query`INSERT INTO users (username, password, role) VALUES (${username}, ${hashedPassword},'admin')`;
    //res.status(201).json({ message: "User registered successfully" });

}



const login = async (req, res) => {
    console.log(req.body)
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: "Please provide username and password" });
        return;
    }
    // chech if username already exist
    const { recordset: users } = await sql.query`SELECT * FROM users WHERE username = ${username}`;
    if (users.length === 0) {
        //res.status(400).json({ message: "Username already exists" });
        console.log("Username not exists")
        return;
    }
    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        console.log("Password is not valid")
        return;
    }
    console.log("Password is valid")
    // redirect page
    res.status(200).json({ message: "Login successful" });
    //res.redirect(302, "/main");

}

const logout = (req, res) => {

}

const authController = {
    register,
    login,
    logout
}

export default authController