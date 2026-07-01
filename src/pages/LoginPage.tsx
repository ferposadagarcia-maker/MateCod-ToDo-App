import { useState, type JSX } from "react";
import { useAuth } from "../features/auth/Authenticator";
import { useNavigate } from "react-router-dom";
import { getAuthErrorMessage } from "../features/auth/authErrors";
import "./LoginPage.css";

function LoginPage(): JSX.Element {
    const { signIn, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(): Promise<void> {
        try {
            await signIn(email, password);
            navigate("/dashboard");
        } catch (err) {
            setError(getAuthErrorMessage(err));
        }
    }

    async function handleGoogle(): Promise<void> {
        await signInWithGoogle();
        navigate("/dashboard");
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Iniciar Sesión</h2>
                <p className="login-subtitle">Gestiona y organiza tus tareas de forma estratégica</p>

                {error && <div className="login-error-alert">{error}</div>}

                <div className="login-form">
                    <div className="login-group">
                        <label className="login-label">Email</label>
                        <input
                            placeholder="correo@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="login-input"
                        />
                    </div>
                    <div className="login-group">
                        <label className="login-label">Contraseña</label>
                        <input
                            placeholder="Tu contraseña"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                        />
                    </div>

                    <button onClick={handleLogin} className="login-submit-btn">
                        Ingresar
                    </button>

                    <button onClick={handleGoogle} className="login-google-btn">
                        <svg className="google-icon" width="18" height="18" viewBox="0 0 18 18">
                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.938 5.482 18 9 18z" fill="#34A853" />
                            <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.96H.957C.347 6.173 0 7.549 0 9s.347 2.827.957 4.04l3.007-2.333z" fill="#FBBC05" />
                            <path d="M9 3.58c1.32 0 2.508.454 3.44 1.345l2.582-2.58C13.463.896 11.426 0 9 0 5.482 0 2.438 2.062.957 4.96L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                        </svg>
                        Iniciar con Google
                    </button>
                </div>
                <p className="login-footer-text">
                    ¿No tienes cuenta?{" "}
                    <button onClick={() => navigate("/register")}
                        className="link-to-register">
                        Regístrate
                    </button>
                </p>
            </div>
        </div>
    );
}
export default LoginPage;