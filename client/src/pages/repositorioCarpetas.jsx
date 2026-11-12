import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./repositorioCarpetas.css";

const API_URL = "http://localhost:3000";

function RepositorioCarpetas() {
    const { id } = useParams();
    const token = localStorage.getItem("token");
    const [repo, setRepo] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [subiendo, setSubiendo] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [archivosIndividuales, setArchivosIndividuales] = useState([]);
    const [archivosCarpeta, setArchivosCarpeta] = useState([]);

    useEffect(() => {
        let activo = true;
        const cargarRepositorio = async () => {
            if (!token) {
                setMensaje("Iniciá sesión para subir archivos.");
                setCargando(false);
                return;
            }

            try {
                const respuesta = await axios.get(
                    `${API_URL}/repositorios/conseguirInformacionRepositorio/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (activo) setRepo(respuesta.data);
            } catch (error) {
                console.error("Error al cargar el repositorio:", error);
                if (activo) {
                    setMensaje(
                        error.response?.data?.message ||
                        "No se pudo cargar el repositorio."
                    );
                }
            } finally {
                if (activo) setCargando(false);
            }
        };

        cargarRepositorio();
        return () => {
            activo = false;
        };
    }, [id, token]);

    const seleccionarArchivos = (event, esCarpeta) => {
        const seleccion = Array.from(event.target.files || []).map(file => ({
            file,
            ruta: esCarpeta
                ? (file.webkitRelativePath || file.name)
                : file.name
        }));
        if (esCarpeta) setArchivosCarpeta(seleccion);
        else setArchivosIndividuales(seleccion);
        event.target.value = "";
    };

    const subirArchivos = async (event) => {
        event.preventDefault();
        const seleccion = [...archivosIndividuales, ...archivosCarpeta];
        if (seleccion.length === 0) {
            setMensaje("Seleccioná archivos individuales o una carpeta.");
            return;
        }

        const formData = new FormData();
        seleccion.forEach(({ file, ruta }) => {
            formData.append("archivos", file, file.name);
            formData.append("rutas", ruta);
        });

        try {
            setSubiendo(true);
            setMensaje("");
            const respuesta = await axios.post(
    `${API_URL}/repositorios/${id}/archivos`,
    formData,
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
);
            setArchivosIndividuales([]);
            setArchivosCarpeta([]);
            setMensaje(
    `${seleccion.length} archivo(s) subido(s) correctamente. Commit #${respuesta.data.id_commit}`
);
        } catch (error) {
            console.error("Error al subir archivos:", error);
            setMensaje(
                error.response?.data?.message || "No se pudieron subir los archivos."
            );
        } finally {
            setSubiendo(false);
        }
    };

    if (cargando) return <main className="detalle-repo">Cargando...</main>;
    if (!repo) {
        return (
            <main className="detalle-repo">
                <p className="detalle-error">{mensaje || "No existe el repositorio."}</p>
                <Link to="/repositorios">Volver a mis repositorios</Link>
            </main>
        );
    }

    return (
        <main className="detalle-repo">
            <Link className="detalle-volver" to={`/repositorios/${id}`}>
                ← Volver al repositorio
            </Link>

            <header className="detalle-cabecera">
                <div>
                    <h1>{repo.nombre || repo.nombre_repo}</h1>
                    <p>{repo.descripcion || "Sin descripción"}</p>
                </div>
                <span>{repo.privado ? "Privado" : "Público"}</span>
            </header>

            <form className="detalle-subida" onSubmit={subirArchivos}>
                <h2>Subir archivos</h2>
                <label>
                    Archivos individuales
                    <input
                        type="file"
                        name="archivos-individuales"
                        multiple
                        onChange={event => seleccionarArchivos(event, false)}
                    />
                </label>
                {archivosIndividuales.length > 0 && (
                    <p>{archivosIndividuales.length} archivo(s) individual(es) seleccionado(s).</p>
                )}

                <label>
                    Carpeta completa
                    <input
                        type="file"
                        name="carpeta"
                        multiple
                        webkitdirectory=""
                        directory=""
                        onChange={event => seleccionarArchivos(event, true)}
                    />
                </label>
                {archivosCarpeta.length > 0 && (
                    <p>{archivosCarpeta.length} archivo(s) de la carpeta seleccionado(s).</p>
                )}

                <button disabled={subiendo}>
                    {subiendo ? "Subiendo..." : "Subir selección"}
                </button>
                {mensaje && <p role="status">{mensaje}</p>}
            </form>
        </main>
    );
}

export default RepositorioCarpetas;
