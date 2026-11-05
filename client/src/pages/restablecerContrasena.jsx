import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const MIN_LARGO = 8;

export default function RestablecerContrasena() {

    //esto es porque donde envio el correo, el token se encuentra en el link, la url,
    //y aca lo saco de los parametros, el useParams transforma todos los parametros y los devuelve como un objeto
    const { token } = useParams();

    // verificando | valido | invalido | listo
    const [estado, setEstado] = useState("verificando");
    const [nueva, setNueva] = useState("");
    const [repetir, setRepetir] = useState("");
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);



    const verificarEnlace = async () => {
        try {
            await axios.get(
                "http://localhost:3000/users/verificar-recuperacion",
                {
                    headers: {
                        recuperacion: token
                    }
                }
            );

            setEstado("valido");
        } catch {
            setEstado("invalido");
        }
    };

    // Al abrir el enlace, el middleware del backend confirma que el token sirve
    useEffect(() => {
        verificarEnlace();
    }, [token]);

    const guardar = async (e) => {
        e.preventDefault();
        //esto limpia los errores de la pantalla, para que no se acumulen
        setError("");

        if (nueva.length < MIN_LARGO) {
            setError(`La contraseña debe tener al menos ${MIN_LARGO} caracteres.`);
            return;
        }
        if (nueva !== repetir) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setGuardando(true);
        try {
            await axios.post(
                "http://localhost:3000/users/restablecer-contrasena",
                { nuevaContraseña: nueva },
                { headers: { recuperacion: token } }
            );
            setEstado("listo");

        } catch (err) {
            if (err.response?.status === 401) {
                setEstado("invalido");
            } else {
                setError(err.response?.data?.message || "No pudimos guardar la contraseña. Probá de nuevo.");
            }
        } finally {
            setGuardando(false);
        }
    };

    if (estado === "verificando") {
        return (
            <div className="login-card">
                <p style={{ fontSize: "14px", color: "#737373" }}>Verificando el enlace...</p>
            </div>
        );
    }

    if (estado === "invalido") {
        return (
            <div className="login-card">
                <p role="alert" style={{ fontSize: "14px", color: "#d93025" }}>
                    El enlace venció o ya se usó. Pedí uno nuevo para cambiar tu contraseña.
                </p>
                <p style={{ marginTop: "20px", fontSize: "14px" }}>
                    <Link to="/olvide-contrasena" style={{ color: "#0095f6", textDecoration: "none", fontWeight: "600" }}>
                        Pedir un enlace nuevo
                    </Link>
                </p>
            </div>
        );
    }

    if (estado === "listo") {
        return (
            <div className="login-card">
                <p role="status" style={{ fontSize: "14px" }}>Tu contraseña se cambió con éxito.</p>
                <p style={{ marginTop: "20px", fontSize: "14px" }}>
                    <Link to="/login" style={{ color: "#0095f6", textDecoration: "none", fontWeight: "600" }}>
                        Iniciar sesión
                    </Link>
                </p>
            </div>
        );
    }

    return (
        <div className="login-card">
            <form onSubmit={guardar} className="login-form">
                <input
                    type="password"
                    placeholder="Nueva contraseña"
                    value={nueva}
                    onChange={(e) => setNueva(e.target.value)}
                    required
                    minLength={MIN_LARGO}
                    className="login-input"
                />
                <input
                    type="password"
                    placeholder="Repetir nueva contraseña"
                    value={repetir}
                    onChange={(e) => setRepetir(e.target.value)}
                    required
                    className="login-input"
                />
                <button type="submit" className="ingresar-button" disabled={guardando}>
                    {guardando ? "Guardando..." : "Guardar contraseña"}
                </button>
            </form>

            {error && (
                <p role="alert" style={{ marginTop: "16px", fontSize: "14px", color: "#d93025" }}>
                    {error}
                </p>
            )}
        </div>
    );
}