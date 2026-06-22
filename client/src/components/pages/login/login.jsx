import HA from '@/assets/HA.png';
import LoginForm from './LoginForm';
// directory is from origin

function login() {
    return (
        <div style={{
            backgroundImage: `url(${HA})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: "100vh",
            width: "100vw",
        }}>
            <LoginForm />
        </div>
    );
}

export default login;