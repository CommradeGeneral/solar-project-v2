import './LoginForm.css'

function LoginForm() {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: '100%',
        }}>
            <div style={{
                display: "flex",
                backgroundColor: "#25304b",
                padding: "20px",
                borderRadius: "5px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                border: "1px solid rgba(91, 95, 199, 0.2)",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "400px",
                height: "270px",
                fontSize: "0.8rem"
            }}>
                <div className="login-header">
                    <h2 style={{ color: "#fff", margin: 0, fontSize: "1.7rem" }}>Login</h2>
                    <p style={{ color: "#fff", margin: 0 }}> Enter your credentials to access the system.</p>
                </div>
                <form style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <label htmlFor="username" style={{ color: "#ffffffff", margin: 0 }}>Username</label>
                        <input className='input-field-dim' type="text" required />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <label htmlFor="password" style={{
                            color: "#ffffffff", margin: 0, '&:hover': {
                                textDecoration: 'underline',
                            }
                        }}>Password</label>
                        <input className='input-field-dim' type="password" required />
                    </div>

                    <button type="submit" style={{
                        background: "linear-gradient(135deg, #5b5fc7 0%, #7a7ee6 100%)",
                        color: "#fff",
                        border: "none",
                        padding: "10px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                        onClick={(e) => {
                            e.preventDefault();
                            console.log("Login");
                        }}
                    >

                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;