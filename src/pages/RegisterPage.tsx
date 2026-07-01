import { useState, type JSX } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";


function RegisterPage(): JSX.Element {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (password !== confirmPassword) {
            setError("La contraseña no coincide.");
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }
        setIsRegistering(true);

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
        } catch (error: any) {
            console.error(error);
            if (error.code === "auth/email-already-in-use") {
                setError("Este correo ya está registrado.");
            } else if (error.code === "auth/invalid-email") {
                setError("El formato de correo no es válido.");
            } else if (error.code === "auth/weak-password" || error.code === "auth/invnvalid-weak-password") {
                setError("La contraseña debe tener al menos 6 caracteres.");
            } else {
                setError("Ocurrió un error al registrarse.");
            }
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="register-title"> Crear tu cuenta</h2>
                <p className="register-subtitle">Registra tus datos y comencemos a organizar tus tareas</p>
                {error && <div className="register-error-alert">{error}</div>}
                <form onSubmit={handleRegister} className="register-form">
                    <div className="register-group">
                        <label className="register-label">Correo Electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="register-input"
                            required
                            disabled={isRegistering}
                        />
                    </div>

                    <div className="register-group">
                        <label className="register-label">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="register-input"
                            required
                            disabled={isRegistering}
                        />
                    </div>

                    <div className="register-group">
                        <label className="register-label">Confirmar Contraseña</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirma tu contraseña"
                            className="register-input"
                            required
                            disabled={isRegistering}
                        />
                    </div>
                    <button type="submit" className="register-submit-button" disabled={isRegistering}>
                        {isRegistering ? "Registrando..." : "Registrarse"}
                    </button>
                </form>

                <p className="register-login-text">
                    ¿Ya tienes tu cuenta?{""}
                    <button onClick={() => navigate("/login")} className="link-to-login">
                        Inicia sesión
                    </button>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;