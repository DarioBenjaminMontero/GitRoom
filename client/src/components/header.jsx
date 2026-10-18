import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import GitRoomLogo from '../assets/GitRoom_Logo.png'
import './header.css'

export default function Header() {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalUnirseAbierto, setModalUnirseAbierto] = useState(false); // estado para la ventana emergente
  const [codigoClase, setCodigoClase] = useState(''); // stado para guardar el código ingresado
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
    e.preventDefault(); 0
    try {

      const response = await axios.post("http://localhost:3000/clases/unirse", { codigo : codigoClase } ,{
        headers: {

          Authorization: `Bearer ${token}`

        }
      },
      );

      alert(`Uniéndose con el código: ${codigoClase}`);
      setModalUnirseAbierto(false);
      setCodigoClase('');
      obtenerClasesHeader();
    } catch (error) {
      console.error("Error al unirse a la clase:", error);
    }
  };

  if (token) {
    return (
      <section id="header">

        <button id="menu-boton" onClick={() => setMenuAbierto(true)}>
          ☰
        </button>


        {menuAbierto && (
          <div className="menu-fondo" onClick={() => setMenuAbierto(false)} />
        )}

        <aside className={`menu-lateral ${menuAbierto ? "abierto" : ""}`}>
          <button onClick={() => setMenuAbierto(false)}>Cerrar</button>
          <button onClick={() => { navigate("/"); setMenuAbierto(false); }}>Inicio</button>
          <button onClick={() => { navigate("/repositorios"); setMenuAbierto(false); }}>Repositorios</button>
          <button onClick={() => { navigate("newRepository"); setMenuAbierto(false); }}>Nuevo repositorio</button>
          <button onClick={() => { navigate("perfil"); setMenuAbierto(false); }}>Perfil</button>
          {/* Botón del menú lateral que abre el modal */}
          <button onClick={() => { setModalUnirseAbierto(true); setMenuAbierto(false); }}>Unirse a una clase</button>

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
          {/* Botón superior que abre el modal */}
          <button onClick={() => setModalUnirseAbierto(true)}>Unirse A una clase</button>
        </div>

        {/* --- VENTANA EMERGENTE (MODAL) --- */}
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
                <p>Pídele a tu profesor el código de la clase y, luego, ingrésalo aquí.</p>
                <input
                  type="text"
                  placeholder="Código de la clase"
                  value={codigoClase}
                  onChange={(e) => setCodigoClase(e.target.value)}
                />
              </div>

              <ul className="modal-lista">
                <li>Usa una cuenta autorizada.</li>
                <li>Usa un código de clase que tenga entre 5 y 8 letras o números, sin espacios ni símbolos.</li>
              </ul>

              <div className="modal-botones">
                <button
                  className="btn-cancelar"
                  onClick={() => setModalUnirseAbierto(false)}
                >
                  Cancelar
                </button>
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