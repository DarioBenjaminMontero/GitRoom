import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function OlvideContrasena() {
    const [mail, setMail] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const enviar = async (e) => {
        e.preventDefault();
        setEnviando(true);
        setError("");
        setMensaje("");

        try {
            const response = await axios.post("http://localhost:3000/users/recuperar-contrasena", { mail });
            setMensaje(response.data.message);
        } catch (err) {
            setError(err.response?.data?.message || "No pudimos enviar el correo. Probá de nuevo en un momento.");
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="login-card">
            <p style={{ marginBottom: "16px", fontSize: "14px", color: "#737373" }}>
                Ingresá el correo de tu cuenta y te enviamos un enlace para crear una contraseña nueva.
            </p>

            <form onSubmit={enviar} className="login-form">
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    required
                    className="login-input"
                />
                <button type="submit" className="ingresar-button" disabled={enviando}>
                    {enviando ? "Enviando..." : "Enviar enlace"}
                </button>
            </form>

            {mensaje && (
                <p role="status" style={{ marginTop: "16px", fontSize: "14px" }}>
                    {mensaje} Revisá también la carpeta de spam.
                </p>
            )}
            {error && (
                <p role="alert" style={{ marginTop: "16px", fontSize: "14px", color: "#d93025" }}>
                    {error}
                </p>
            )}

            <p style={{ marginTop: "20px", fontSize: "14px", color: "#737373" }}>
                <Link to="/login" style={{ color: "#0095f6", textDecoration: "none", fontWeight: "600" }}>
                    Volver a iniciar sesión
                </Link>
            </p>
        </div>
    );
}