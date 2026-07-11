import sql from "mssql/msnodesqlv8.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_access_token";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "super_secret_refresh_token";

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

    const accessToken = jwt.sign(
        { username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: "1m" }
    );

    const refreshToken = jwt.sign(
        { username: user.username, role: user.role },
        JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Set non-HttpOnly cookies for frontend to read
    res.cookie("username", user.username, {
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.cookie("role", user.role, {
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // redirect page
    res.redirect(302, "/main");

}

const logout = (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("username");
    res.clearCookie("role");
    res.redirect(302, "/login");
}

const authController = {
    register,
    login,
    logout
}

export default authController