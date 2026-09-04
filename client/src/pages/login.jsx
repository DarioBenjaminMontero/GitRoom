import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const logear = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/login", {
                email,
                password,
            });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            console.log(localStorage);
            navigate("/")
        }
        catch (error) {
            alert("Error al iniciar sesión: " + (error.response?.data?.message || error.message));
            console.log(localStorage);
        }
    };

    return (
        <div className="login-card">
          
          <form onSubmit={logear} className="login-form">
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="login-input"
            />
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="login-input"
            />
            <button type="submit" className="ingresar-button">
              Ingresar
            </button>
          </form>
          <p style={{ marginTop: "20px", fontSize: "14px", color: "#737373" }}>
            ¿No tienes cuenta? <Link to="/register" style={{ color: "#0095f6", textDecoration: "none", fontWeight: "600" }}>Regístrate aquí</Link>
          </p>
        </div>
      );
    }