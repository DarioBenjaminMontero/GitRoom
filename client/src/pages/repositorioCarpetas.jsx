import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./repositorioCarpetas.css";

function RepositorioCarpetas() {
  const { id } = useParams();
  const [repo, setRepo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [carpetaAbierta, setCarpetaAbierta] = useState(false);

  useEffect(() => {
    const traerRepositorio = async () => {
      try {
        const token = localStorage.getItem("token");
        const respuesta = await axios.get("http://localhost:3000/repositorios/traerRepos", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const encontrado = respuesta.data.find((item) => String(item.id_repo) === id);

        if (!encontrado) {
          console.log("No se encontró el repositorio.");
        } else {
          setRepo(encontrado);
        }
      } catch (error) {
        console.log(error);
      }

      setCargando(false);
    };

    traerRepositorio();
  }, [id]);

  if (cargando) {
    return <main className="detalle-repo"><p>Cargando repositorio...</p></main>;
  }

  if (!repo) {
    return (
      <main className="detalle-repo">
        <Link to="/repositorios" className="detalle-volver">Volver a repositorios</Link>
        <p className="detalle-error">No se pudo cargar el repositorio.</p>
      </main>
    );
  }

  return (
    <main className="detalle-repo">
      <Link to="/repositorios" className="detalle-volver">Mis repositorios</Link>
      <header className="detalle-cabecera">
        <div>
          <p className="detalle-ruta">Repositorio</p>
          <h1>{repo.nombre_repo}</h1>
          <p>{repo.descripcion || "Sin descripción"}</p>
        </div>
        <span className="detalle-visibilidad">{repo.es_privado ? "Privado" : "Público"}</span>
      </header>

      <section className="detalle-contenido" aria-label="Contenido del repositorio">
        <h2>Archivos</h2>
        <button
          className="detalle-carpeta"
          type="button"
          aria-expanded={carpetaAbierta}
          onClick={() => setCarpetaAbierta(!carpetaAbierta)}
        >
          <span aria-hidden="true">📁</span>
          <span>Archivos</span>
          <span className="detalle-carpeta-estado">{carpetaAbierta ? "Abierta" : "Carpeta"}</span>
        </button>
        {carpetaAbierta && <p className="detalle-vacio">Esta carpeta está vacía.</p>}
      </section>
    </main>
  );
}

export default RepositorioCarpetas;