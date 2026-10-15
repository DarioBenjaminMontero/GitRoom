import { useState, useEffect } from 'react'  
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import GitRoomLogo from '../assets/GitRoom_Logo.png'
import './header.css'

export default function Header() {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [clases, setClases] = useState([]);
  
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (token) {
      obtenerClasesHeader();
    }
  }, [token]);

  const obtenerClasesHeader = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users/clases', {
        headers: { authorization: token }
      });

      if (Array.isArray(response.data)) {
        setClases(response.data);
      } else if (Array.isArray(response.data.clases)) {
        setClases(response.data.clases);
      } else {
        setClases([]);
      }
    } catch (error) {
      console.error('Error al obtener clases para el menu lateral:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('Sesión cerrada');
    navigate('/login');
  };

  
  if (token) {
    return (
      <section id="header">
        {/* BOTON DEL MENU */}
        <button id="menu-boton" onClick={() => setMenuAbierto(true)}>
          ☰
        </button>

        {/* MENU LATERAL */}
        {menuAbierto && (
          <div className="menu-fondo" onClick={() => setMenuAbierto(false)} />
        )}

        <aside className={`menu-lateral ${menuAbierto ? "abierto" : ""}`}>
          <button onClick={() => setMenuAbierto(false)}>Cerrar</button>
          <button onClick={() => { navigate("/"); setMenuAbierto(false); }}>Inicio</button>
          <button onClick={() => { navigate("/repositorios"); setMenuAbierto(false); }}>Repositorios</button>
          <button onClick={() => { navigate("newRepository"); setMenuAbierto(false); }}>Nuevo repositorio</button>
          <button onClick={() => { navigate("perfil"); setMenuAbierto(false); }}>Perfil</button>

          <hr style={{ margin: "12px 0", borderColor: "#444" }} />

          {/* LISTA DE CLASES EN EL MENÚ LATERAL */}
          <div style={{ padding: "0 8px", textAlign: "left" }}>
            <p style={{ fontSize: "12px", color: "#aaa", marginBottom: "8px" }}>TUS CLASES</p>
            {clases.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {clases.map((clase, index) => (
                  <button
                    key={clase.id_clase || index}
                    onClick={() => setMenuAbierto(false)}
                    style={{
                      textAlign: "left",
                      backgroundColor: "#2e335a",
                      color: "white",
                      border: "none",
                      padding: "8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "13px"
                    }}
                  >
                    📘 {clase.nombreClase}
                  </button>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: "12px", color: "#888" }}>Sin clases inscriptas</p>
            )}
          </div>
        </aside>

        <img src={GitRoomLogo} width="140" height="100" alt="" onClick={() => navigate("/")} />

        <h2>Bienvenido {user?.username}</h2>

        <div className='header-buttons'>
          <button id="repositorios-boton" onClick={() => navigate("/repositorios")}>
            Repositorios
          </button>
          <button id="sesion" onClick={logout}>
            Cerrar Sesión
          </button>
          <button id="newRepo" onClick={() => navigate("newRepository")}>
            repo
          </button>
        </div>
      </section>
    );
  } else {
    return (
      <section id="header">
        <img src={GitRoomLogo} width="140" height="100" alt="" onClick={() => navigate("/")} />

        <div className='header-buttons'>
          <button id="sesion" onClick={() => navigate("/login")}>
            Iniciar Sesion
          </button>
          <button id="registrar" onClick={() => navigate("register")}>
            Registrarse
          </button>
        </div>
      </section>
    );
  }

}