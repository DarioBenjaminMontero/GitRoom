import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./repositorios.css";

const LIMITE = 7;

function MisRepositorios() {
  const [repos, setRepos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [verTodos, setVerTodos] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("user")) || { username: "" };

  useEffect(() => {
    const traerRepos = async () => {
      try {
        const response = await axios.get("http://localhost:3000/repositorios/traerRepos", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRepos(response.data);
      } catch (err) {
        console.error("Error al traer los repositorios:", err);
      }
    };

    if (token) {
      traerRepos();
    }
  }, [token]);

  const filtrados = repos.filter((repo) =>
    repo.nombre_repo.toLowerCase().includes(busqueda.toLowerCase())
  );
  const visibles = verTodos ? filtrados : filtrados.slice(0, LIMITE);

  const recientes = [...repos]
    .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
    .slice(0, 3);

  return (
    <div className="repos-layout">
      {/*lo que esta en el lateral*/}
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

        {filtrados.length === 0 && (
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
      {/*lo que esta en el centro*/}
      <main className="repos-centro">
        <h1>{"Hola"}, {usuario.username}!</h1>

        <section className="seccion">
          <h2>Repositorios recientes</h2>
          <div className="tarjeta">
            {recientes.length === 0 ? (<p className="sidebar-mensaje">Cuando crees un repositorio, va a aparecer acá.</p>) 
            : (
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