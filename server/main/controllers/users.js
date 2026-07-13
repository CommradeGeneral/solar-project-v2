import sql from "mssql/msnodesqlv8.js";
import bcrypt from "bcrypt";

const errorCodes = {
    1: { en: "Database error", ar: "خطأ في قاعدة البيانات" },
    2: { en: "Username already exists", ar: "اسم المستخدم موجود بالفعل" },
    3: { en: "Cannot delete yourself", ar: "لا يمكن حذف نفسك" },
    4: { en: "Missing fields", ar: "حقول مفقودة" },
    5: { en: "Forbidden", ar: "ممنوع" },
    6: { en: "User not found", ar: "المستخدم غير موجود" },
    7: { en: "User deleted", ar: "تم حذف المستخدم" }
}

const getUsers = async (req, res) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: errorCodes[5], errorCode: 5 });
    }
    try {
        const { recordset: users } = await sql.query`SELECT username, role FROM users`;
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: errorCodes[1], errorCode: 1 });
    }
};

const addUser = async (req, res) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden" });
    }
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ message: errorCodes[4], errorCode: 4 });
    }
    // chech if table exists 
    const { recordset: tableExists } = await sql.query`SELECT * FROM users`;
    if (tableExists.length === 0) {
        await createTable();
    }
    try {
        const { recordset: existing } = await sql.query`SELECT * FROM users WHERE username = ${username}`;
        if (existing.length > 0) {
            return res.status(400).json({ message: errorCodes[2], errorCode: 2 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await sql.query`INSERT INTO users (username, password, role) VALUES (${username}, ${hashedPassword}, ${role})`;
        res.json({ message: { en: "User added successfully", ar: "تم إضافة المستخدم بنجاح" } });
    } catch (error) {
        res.status(500).json({ message: errorCodes[1], errorCode: 1 });
    }
};

const addUserManually = async (username, password, role) => {
    if (!username || !password || !role) {
        return;
    }
    // chech if table exists 
    const { recordset: tableExists } = await sql.query`SELECT * FROM users`;
    if (tableExists.length === 0) {
        await createTable();
    }
    try {
        const { recordset: existing } = await sql.query`SELECT * FROM users WHERE username = ${username}`;
        if (existing.length > 0) {
            return console.log(errorCodes[2]);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await sql.query`INSERT INTO users (username, password, role) VALUES (${username}, ${hashedPassword}, ${role})`;
    } catch (error) {
        console.log(error);
    }
};

const deleteUser = async (req, res) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: errorCodes[5], errorCode: 5 });
    }
    const { username } = req.params;
    if (username === req.user.username) {
        return res.status(400).json({ message: errorCodes[3], errorCode: 3 });
    }
    try {
        await sql.query`DELETE FROM users WHERE username = ${username}`;
        res.json({ message: { en: "User deleted", ar: "تم حذف المستخدم" } });
    } catch (error) {
        res.status(500).json({ message: errorCodes[1], errorCode: 1 });
    }
};


const createTable = async () => {
    try {
        await sql.query`CREATE TABLE users (username VARCHAR(50) PRIMARY KEY, password VARCHAR(60) NOT NULL, role VARCHAR(50) NOT NULL DEFAULT 'user')`;
        console.log("Table created successfully");
    } catch (error) {
        console.log(error);
    }
};

export default { getUsers, addUser, addUserManually, deleteUser };
