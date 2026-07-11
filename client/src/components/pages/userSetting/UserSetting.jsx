import { useEffect, useState } from "react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";
import './UserSetting.css';

export default function UserSetting({ dir }) {
    const lang = dir?.lang || 'en';

    const t = {
        title: { en: "User Management", ar: "إدارة المستخدمين" },
        accessDeniedTitle: { en: "Access Denied", ar: "الوصول مرفوض" },
        accessDeniedMsg: { en: "Only users with the 'admin' role can manage users.", ar: "فقط المستخدمون بصلاحية 'مسؤول' يمكنهم إدارة المستخدمين." },
        username: { en: "Username", ar: "اسم المستخدم" },
        password: { en: "Password", ar: "كلمة المرور" },
        role: { en: "Role", ar: "الصلاحية" },
        admin: { en: "Admin", ar: "مسؤول" },
        user: { en: "User", ar: "مستخدم" },
        addUser: { en: "Add User", ar: "إضافة مستخدم" },
        actions: { en: "Actions", ar: "إجراءات" },
        delete: { en: "Delete", ar: "حذف" },
        confirmDelete: { en: "Are you sure you want to delete", ar: "هل أنت متأكد أنك تريد حذف" },
        noUsers: { en: "No users found", ar: "لم يتم العثور على مستخدمين" },
        fetchError: { en: "Failed to fetch users. Ensure you are an admin.", ar: "فشل في جلب المستخدمين. تأكد من أنك مسؤول." }
    };
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("admin");
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const cookies = document.cookie.split("; ");
        const roleCookie = cookies.find(c => c.startsWith("role="));
        if (roleCookie && roleCookie.split("=")[1] === "admin") {
            setIsAdmin(true);
            fetchUsers();
        }
    }, []);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const fetchUsers = () => {
        fetch("/api/users")
            .then(res => {
                if (res.status === 403) throw new Error("Forbidden");
                return res.json();
            })
            .then(data => setUsers(data))
            .catch(e => setError(t.fetchError[lang]));
    };

    const handleAddUser = (e) => {
        e.preventDefault();
        setError("");
        fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, role })
        }).then(async res => {
            if (res.ok) {
                setUsername("");
                setPassword("");
                fetchUsers();
            } else {
                const data = await res.json();
                setError(data.message);
            }
        });
    };

    const handleDelete = (targetUser) => {
        if (!window.confirm(`${t.confirmDelete[lang]} ${targetUser}?`)) return;
        fetch(`/api/users/${targetUser}`, { method: "DELETE" })
            .then(async res => {
                if (!res.ok) {
                    const data = await res.json();
                    setError(data.message);
                } else {
                    fetchUsers();
                }
            });
    };

    if (!isAdmin) {
        return (
            <div style={{ padding: "40px", color: "white", textAlign: "center" }}>
                <h2>{t.accessDeniedTitle[lang]}</h2>
                <p>{t.accessDeniedMsg[lang]}</p>
            </div>
        );
    }

    return (
        <div dir={dir?.dir || "ltr"} style={{ boxSizing: "border-box", padding: "20px", color: "white", width: "100%", height: "100%", display: "flex", flexDirection: "column", direction: dir?.dir || "ltr" }}>
            <h2 style={{ marginTop: 0 }}>{t.title[lang]}</h2>
            {/* TODO: animated error message in a fixed position, slides down on error and slides up when error is cleared , disappears after 5 seconds */}
            {error && <div className="error" style={{ boxSizing: "border-box", backgroundColor: "rgba(255,0,0,0.2)", padding: "10px", border: "1px solid red", marginBottom: "20px", flexShrink: 0, position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", borderRadius: "8px", zIndex: '1000', animation: "slideDownUp 5.5s ease-in-out 1" }}>{error[lang] || error.en}</div>}

            <form onSubmit={handleAddUser} style={{ boxSizing: "border-box", display: "flex", gap: "10px", marginBottom: "20px", background: "rgba(255,255,255,0.05)", padding: "20px", borderRadius: "8px", flexShrink: 0 }}>
                <input
                    placeholder={t.username[lang]}
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    style={{ flex: 1, padding: "8px" }}
                    className="setting-input"
                />
                <input
                    type="password"
                    placeholder={t.password[lang]}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ flex: 1, padding: "8px" }}
                    className="setting-input"
                />
                <select value={role} onChange={e => setRole(e.target.value)} style={{ padding: "8px" }}>
                    <option value="admin">{t.admin[lang]}</option>
                    <option value="user">{t.user[lang]}</option>
                </select>
                <button className="setting-button" type="submit" style={{ padding: "8px 16px", }}>
                    {t.addUser[lang]}
                </button>
            </form>

            <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", background: "rgba(0,0,0,0.2)" }}>
                <OverlayScrollbarsComponent dir={dir?.dir || "ltr"} options={{ scrollbars: { autoHide: 'move', theme: 'os-theme-light' } }} style={{ height: "100%" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#1a1a24" }}>
                            <tr style={{ borderBottom: "2px solid #555", textAlign: lang === 'ar' ? "right" : "left" }}>
                                <th style={{ padding: "12px" }}>{t.username[lang]}</th>
                                <th style={{ padding: "12px" }}>{t.role[lang]}</th>
                                <th style={{ padding: "12px", width: "100px" }}>{t.actions[lang]}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u, idx) => (
                                <tr key={u.username + idx} style={{ borderBottom: "1px solid #333" }}>
                                    <td style={{ padding: "12px" }}>{u.username}</td>
                                    <td style={{ padding: "12px" }}>
                                        <span style={{
                                            padding: "4px 8px",
                                            borderRadius: "12px",
                                            fontSize: "0.85em",
                                            background: u.role === "admin" ? "rgba(255,193,7,0.2)" : "rgba(33,150,243,0.2)",
                                            color: u.role === "admin" ? "#ffc107" : "#2196f3"
                                        }}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: "12px", width: "100px" }}>
                                        <button
                                            onClick={() => !u.isDummy && handleDelete(u.username)}
                                            disabled={u.isDummy}
                                            style={{ padding: "6px 12px", cursor: u.isDummy ? "not-allowed" : "pointer", background: u.isDummy ? "#555" : "#f44336", color: "white", border: "none", borderRadius: "4px" }}
                                        >
                                            {t.delete[lang]}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </OverlayScrollbarsComponent>
            </div>
        </div>
    );
}
