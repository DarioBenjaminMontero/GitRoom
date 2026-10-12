import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./repositorios.css";

const LIMITE = 7;

function MisRepositorios() {
  const [repos, setRepos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [verTodos, setVerTodos] = useState(false);
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("user")) || { username: "" };

  useEffect(() => {
    const traerRepos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/repositorios/traerRepos", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          const cuerpo = await res.text();
          console.log("Status:", res.status, "Respuesta:", cuerpo);
          throw new Error(`Error ${res.status}`);
        }

        const data = await res.json();
        setRepos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    traerRepos();
  }, []);

  // Barra lateral: filtrar por búsqueda y cortar en LIMITE
  const filtrados = repos.filter((repo) =>
    repo.nombre_repo.toLowerCase().includes(busqueda.toLowerCase())
  );
  const visibles = verTodos ? filtrados : filtrados.slice(0, LIMITE);

  // Centro: los 3 más nuevos
  const recientes = [...repos]
    .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
    .slice(0, 3);

  return (
    <div className="repos-layout">
      {/* ---------- Barra lateral ---------- */}
      <aside className="repos-sidebar">
        <div className="sidebar-titulo">
          <span>Tus repositorios</span>
          <button className="boton-nuevo" onClick={() => navigate("/newRepository")}>
            Nuevo
          </button>
        </div>

        <input
          className="sidebar-buscar"
          placeholder="Buscar un repositorio..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        {cargando && <p className="sidebar-mensaje">Cargando...</p>}
        {error && <p className="sidebar-mensaje">{error}</p>}
        {!cargando && !error && filtrados.length === 0 && (
          <p className="sidebar-mensaje">
            {busqueda ? "No hay coincidencias" : "Todavía no tenés repositorios"}
          </p>
        )}

        <ul className="sidebar-lista">
          {visibles.map((repo) => (
            <li key={repo.id_repo}>
              <Link to={`/repositorios/${repo.id_repo}`}>
                <span>{repo.es_privado ? "🔒" : "📁"}</span>
                {usuario.username}/{repo.nombre_repo}
              </Link>
            </li>
          ))}
        </ul>

        {filtrados.length > LIMITE && (
          <button className="ver-mas" onClick={() => setVerTodos(!verTodos)}>
            {verTodos ? "Mostrar menos" : "Mostrar más"}
          </button>
        )}
      </aside>

      {/* ---------- Centro ---------- */}
      <main className="repos-centro">
        <h1>{"Hola"}, {usuario.username}!</h1>

        <section className="seccion">
          <h2>Repositorios recientes</h2>
          <div className="tarjeta">
            {recientes.length === 0 ? (
              <p className="sidebar-mensaje">Cuando crees un repositorio, va a aparecer acá.</p>
            ) : (
              recientes.map((repo) => (
                <div className="tarjeta-repo" key={repo.id_repo}>
                  <Link to={`/repositorios/${repo.id_repo}`} style={{ color: "#b794f6" }}>
                    {repo.nombre_repo}
                  </Link>
                  <span className="etiqueta">{repo.es_privado ? "Privado" : "Público"}</span>
                  <p>{repo.descripcion || "Sin descripción"}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default MisRepositorios;