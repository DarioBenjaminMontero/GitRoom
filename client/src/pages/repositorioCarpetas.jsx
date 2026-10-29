import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./repositorioCarpetas.css";

function RepositorioCarpetas() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [repo, setRepo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const traerRepositorio = async () => {
      try {
        const response = await axios.get("http://localhost:3000/repositorios/traerRepos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRepo(response.data.find((item) => String(item.id_repo) === id));
      } catch (error) {
        console.error("Error al traer el repositorio:", error);
        setMensaje("No se pudo cargar el repositorio.");
      }
      setCargando(false);
    };

    if (token) {
      traerRepositorio();
    }
  }, [id, token]);

  const subirArchivo = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    // FormData mantiene el nombre "archivos" que espera Multer para la subida múltiple.
    const archivos = form.elements.archivos.files;
    setSubiendo(true);
    setMensaje("");

    try {
      await axios.post(`http://localhost:3000/repositorios/${id}/archivos`, new FormData(form), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensaje(`${archivos.length} archivo(s) subido(s) correctamente.`);
      form.reset();
    } catch (error) {
      setMensaje(error.response?.data?.message || "No se pudo subir el archivo.");
    }
    setSubiendo(false);
  };

  if (!token) {
    return (
      <main className="detalle-repo">
        <Link to="/repositorios" className="detalle-volver">← Mis repositorios</Link>
        <p className="detalle-error" role="alert">Iniciá sesión para ver este repositorio.</p>
      </main>
    );
  }

  if (cargando) {
    return <main className="detalle-repo"><p>Cargando repositorio...</p></main>;
  }

  if (!repo) {
    return (
      <main className="detalle-repo">
        <Link to="/repositorios" className="detalle-volver">← Mis repositorios</Link>
        <p className="detalle-error" role="alert">{mensaje || "No se encontró el repositorio."}</p>
      </main>
    );
  }

  return (
    <main className="detalle-repo">
      <Link to="/repositorios" className="detalle-volver">← Mis repositorios</Link>
      <header className="detalle-cabecera">
        <h1>{repo.nombre_repo}</h1>
        <span>{repo.es_privado ? "Privado" : "Público"}</span>
      </header>

      <form className="detalle-subida" onSubmit={subirArchivo}>
        <h2>Subir archivos</h2>
        <input type="file" name="archivos" multiple required />
        <button type="submit" disabled={subiendo}>
          {subiendo ? "Subiendo..." : "Subir archivos"}
        </button>
        {mensaje && <p role="status">{mensaje}</p>}
      </form>
    </main>
  );
}

export default RepositorioCarpetas;
