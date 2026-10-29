import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import GitRoomLogo from '../assets/GitRoom_Logo.png'
import './header.css'

export default function Header({ onClaseCreada }) {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalUnirseAbierto, setModalUnirseAbierto] = useState(false);
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [nombreClase, setNombreClase] = useState('');
  const [codigoClase, setCodigoClase] = useState('');
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

  const handleUnirseClase = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/clases/unirse", { codigo: codigoClase }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(`Uniéndose con el código: ${codigoClase}`);
      setModalUnirseAbierto(false);
      setCodigoClase('');
      await obtenerClasesHeader();
      
      if (onClaseCreada) {
        onClaseCreada(); // 🚀 Dispara la actualización global
      }
    } catch (error) {
      console.error("Error al unirse a la clase:", error);
    }
  };

  const handleCrearClase = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      await axios.post("http://localhost:3000/clases/crear", { nombreClase: nombreClase }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(`Clase creada con éxito: ${nombreClase}`);
      setModalCrearAbierto(false);
      setNombreClase('');
      await obtenerClasesHeader();
      
      if (onClaseCreada) {
        onClaseCreada(); // 🚀 Dispara la actualización global para que el Home se entere
      }
    } catch (error) {
      console.error("Error al crear la clase:", error);
      alert("Hubo un error al crear la clase.");
    }
  };

  if (!token) {
    return (
      <section id="header">
        <img src={GitRoomLogo} width="140" height="100" alt="" onClick={() => navigate("/")} />
        <div className='header-buttons'>
          <button id="sesion" onClick={() => navigate("/login")}>Iniciar Sesion</button>
          <button id="registrar" onClick={() => navigate("register")}>Registrarse</button>
        </div>
      </section>
    );
  }

  return (
    <section id="header">
      <button id="menu-boton" onClick={() => setMenuAbierto(true)}>☰</button>

      {menuAbierto && <div className="menu-fondo" onClick={() => setMenuAbierto(false)} />}

      <aside className={`menu-lateral ${menuAbierto ? "abierto" : ""}`}>
        <button onClick={() => setMenuAbierto(false)}>Cerrar</button>
        <button onClick={() => { navigate("/"); setMenuAbierto(false); }}>Inicio</button>
        <button onClick={() => { navigate("/repositorios"); setMenuAbierto(false); }}>Repositorios</button>
        <button onClick={() => { navigate("newRepository"); setMenuAbierto(false); }}>Nuevo repositorio</button>
        <button onClick={() => { navigate("perfil"); setMenuAbierto(false); }}>Perfil</button>
        <button onClick={() => { setModalUnirseAbierto(true); setMenuAbierto(false); }}>Unirse a una clase</button>
        <button onClick={() => { navigate("/buscar-usuarios"); setMenuAbierto(false); }}>Buscar usuarios</button>
        <hr style={{ margin: "12px 0", borderColor: "#444" }} />

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
        <button id="repositorios-boton" onClick={() => navigate("/repositorios")}>Repositorios</button>
        <button id="sesion" onClick={logout}>Cerrar Sesión</button>
        <button id="newRepo" onClick={() => navigate("newRepository")}>repo</button>
        <button id="chats" onClick={() => navigate("/chats")}>chats</button>
        <button onClick={() => setModalUnirseAbierto(true)}>Unirse A una clase</button>
        <button onClick={() => setModalCrearAbierto(true)}>Crear una clase</button>
      </div>

      {/* --- MODAL UNIRSE --- */}
      {modalUnirseAbierto && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <h2>Unirse a una clase</h2>
            <div className="modal-seccion">
              <p>Accediste como</p>
              <div className="usuario-info">
                <strong>{user?.username}</strong>
                <span>{user?.email || user?.mail}</span>
              </div>
            </div>
            <div className="modal-seccion">
              <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}>Código de la clase</label>
              <input
                type="text"
                placeholder="Código de la clase"
                value={codigoClase}
                onChange={(e) => setCodigoClase(e.target.value)}
              />
            </div>
            <div className="modal-botones">
              <button className="btn-cancelar" onClick={() => setModalUnirseAbierto(false)}>Cancelar</button>
              <button
                className={`btn-unirse ${codigoClase.trim() ? 'activo' : ''}`}
                disabled={!codigoClase.trim()}
                onClick={handleUnirseClase}
              >
                Unirte
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL CREAR --- */}
      {modalCrearAbierto && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <h2>Crear una clase</h2>
            <div className="modal-seccion">
              <p>Accediste como</p>
              <div className="usuario-info">
                <strong>{user?.username}</strong>
                <span>{user?.email || user?.mail}</span>
              </div>
            </div>
            <div className="modal-seccion">
              <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}>Nombre de la clase</label>
              <input
                type="text"
                placeholder="Nombre de la clase"
                value={nombreClase}
                onChange={(e) => setNombreClase(e.target.value)}
              />
            </div>
            <div className="modal-botones">
              <button className="btn-cancelar" onClick={() => setModalCrearAbierto(false)}>Cancelar</button>
              <button
                className={`btn-unirse ${nombreClase.trim() ? 'activo' : ''}`}
                disabled={!nombreClase.trim()}
                onClick={handleCrearClase}
              >
                Crear {/* 👈 Cambiado de "Unirte" a "Crear" */}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}