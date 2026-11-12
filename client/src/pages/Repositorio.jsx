import { useCallback, useEffect, useState } from "react";
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import './Repositorio.css';

export default function Repositorio() {
    const [nombreRepo, setNombreRepo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fecha, setFecha] = useState('');
    const [privado, setPrivado] = useState(false);
    const [colaboradores, setColaboradores] = useState([]);
    const [archivos, setArchivos] = useState([]); // <--- Estado para los archivos
    const { idRepo } = useParams();
    const [carpetaActual, setCarpetaActual] = useState('');
    const navigate = useNavigate();
    const [commits, setCommits] = useState([]);
    const [commitSeleccionado, setCommitSeleccionado] = useState("");
    const [errorArchivos, setErrorArchivos] = useState("");

    const traerInformacionRepositorio = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const consulta = await axios.get(`http://localhost:3000/repositorios/conseguirInformacionRepositorio/${idRepo}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setNombreRepo(consulta.data.nombre || '');
            setDescripcion(consulta.data.descripcion || '');
            setFecha(consulta.data.fecha || '');
            setPrivado(consulta.data.privado || false);
        } catch (error) {
            console.error("Error al traer info del repo:", error.response?.data || error.message);
        }
    }, [idRepo]);
    const traerCommits = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");

            const respuesta = await axios.get(
                `http://localhost:3000/commits/repositorio/${idRepo}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setCommits(respuesta.data || []);

            if (respuesta.data?.length > 0) {
                setCommitSeleccionado(
                    String(respuesta.data[0].id_commit)
                );
            }
        } catch (error) {
            console.error(
                "Error al traer commits:",
                error.response?.data || error.message
            );
        }
    }, [idRepo]);
    const traerColaboradores = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const respuesta = await axios.get(`http://localhost:3000/repositorios/conseguirColaboradores/${idRepo}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setColaboradores(respuesta.data || []);
        } catch (error) {
            console.error("Error al traer colaboradores:", error.response?.data || error.message);
        }
    }, [idRepo]);

    const traerArchivos = useCallback(async (carpeta = "") => {
        if (!commitSeleccionado) return;

        try {
            setErrorArchivos("");
            const token = localStorage.getItem("token");

            const respuesta = await axios.get(
                `http://localhost:3000/archivos/repositorio/${idRepo}/traerArchivos`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        carpeta,
                        id_commit: commitSeleccionado
                    }
                }
            );

            setArchivos(respuesta.data || []);
            setCarpetaActual(carpeta);

        } catch (error) {
            console.error(
                "Error al traer archivos:",
                error.response?.data || error.message
            );
            setArchivos([]);
            setErrorArchivos(
                error.response?.data?.message ||
                "No se pudieron cargar los archivos del repositorio."
            );
        }
    }, [idRepo, commitSeleccionado]);
    const entrarCarpeta = (ruta) => {
        traerArchivos(ruta);
    };
    const volverCarpeta = () => {
        const partes = carpetaActual.split('/');

        partes.pop();

        const carpetaPadre = partes.join('/');

        traerArchivos(carpetaPadre);
    };
    useEffect(() => {
    if (idRepo) {
        traerInformacionRepositorio();
        traerColaboradores();
        traerCommits();
    }
}, [
    idRepo,
    traerInformacionRepositorio,
    traerColaboradores,
    traerCommits
]);

useEffect(() => {
    if (commitSeleccionado) {
        setCarpetaActual("");
        traerArchivos("");
    }
}, [commitSeleccionado, traerArchivos]);

    return (
        <div className="repo-page">
            {/* Top Header */}
            <div className="repo-header">
                <div className="repo-title">
                    <img src="https://via.placeholder.com/32" alt="Avatar" />
                    <span>{nombreRepo || 'Cargando...'}</span>
                    <span className="badge">{privado ? "Private" : "Public"}</span>
                </div>
                <div className="repo-actions">
                    <input type="text" placeholder="Go to file" />
                    <button onClick={() => navigate(`/repositorios/subir/${idRepo}`)}>Add file ▾</button>
                    <button className="btn-green">&lt;&gt; Code ▾</button>
                </div>
            </div>

            {/* Main Container */}
            <div className="repo-container">
                {/* Left Side: Files & Readme */}
                <div className="repo-main">

<div style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px"
}}>
    <label>Versión del repositorio:</label>

    <select
        value={commitSeleccionado}
        onChange={(e) => setCommitSeleccionado(e.target.value)}
    >
        {commits.map((commit) => (
            <option
                key={commit.id_commit}
                value={commit.id_commit}
            >
                Commit #{commit.id_commit}
            </option>
        ))}
    </select>
</div>

                    {/* Caja de Archivos del Repositorio */}
                    <div className="box">
                        <div className="box-header purple">
                            <div>
                                <img src="https://via.placeholder.com/24" alt="User" />
                                <strong>Archivos del Repositorio</strong>
                            </div>
                            <div>{archivos.length} archivo(s)</div>
                        </div>

                        <div className="box-body" style={{
                            padding: '16px',
                            background: '#000000'
                        }}>

                            {/* Navegación */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                marginBottom: '15px'
                            }}>

                                {carpetaActual !== '' && (
                                    <button onClick={volverCarpeta}>
                                        ← Volver
                                    </button>
                                )}

                                <span>
                                    {carpetaActual || 'Repositorio'}
                                </span>

                            </div>

                            {errorArchivos ? (
                                <p role="alert" style={{ color: '#f85149', fontSize: '14px' }}>
                                    {errorArchivos}
                                </p>
                            ) : archivos.length === 0 ? (

                                <p style={{ color: '#666', fontSize: '14px' }}>
                                    Esta carpeta está vacía.
                                </p>

                            ) : (

                                <ul style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    margin: 0
                                }}>

                                    {archivos.map((elemento) => (

                                        <li
                                            key={
                                                elemento.tipo === 'carpeta'
                                                    ? elemento.rutaParaNavegar
                                                    : elemento.id_archivo
                                            }
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '10px 0',
                                                borderBottom: '1px solid #eaeaea',
                                                color: "white"
                                            }}
                                        >

                                            {elemento.tipo === 'carpeta' ? (

                                                <span
                                                    onClick={() => entrarCarpeta(
                                                        elemento.rutaParaNavegar
                                                    )}
                                                    style={{
                                                        cursor: 'pointer',
                                                        color: '#0969da',
                                                        fontWeight: '500'
                                                    }}
                                                >
                                                    📁 {elemento.nombre}
                                                </span>

                                            ) : (

                                                <>
                                                    <span>
                                                        📄 {elemento.nombre}
                                                    </span>

                                                    <a
                                                        href={elemento.urlCompleta}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            color: '#0969da',
                                                            textDecoration: 'none',
                                                            fontWeight: '500'
                                                        }}
                                                    >
                                                        Ver / Descargar
                                                    </a>
                                                </>

                                            )}

                                        </li>

                                    ))}

                                </ul>

                            )}

                        </div>

                    </div>

                    <div className="box">
                        <div className="box-header light">
                            <h3>Readme</h3>
                        </div>
                        <div className="box-body gray center">
                            <h3>Add a README</h3>
                            <p>{"Help people interested in this repository understand your project."}</p>
                            <button className="btn-readme">Add a Readme</button>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="repo-sidebar">
                    <div className="side-section">
                        <h3>About</h3>
                        <p>{descripcion || 'No description, website, or topics provided.'}</p>
                        {fecha && <p>Creado el {new Date(fecha).toLocaleDateString()}</p>}
                    </div>

                    <div className="side-section">
                        <h3>Contributors</h3>
                        <div className="avatars" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {colaboradores.length > 0 ? (
                                colaboradores.map((user) => (
                                    <img
                                        key={user.id_usuario}
                                        src={user.foto_perfil ? `http://localhost:3000/uploads/${user.foto_perfil}` : "https://via.placeholder.com/32"}
                                        alt={user.nombre}
                                        title={`${user.nombre} ${user.apellido}`}
                                        className="avatar-small"
                                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                ))
                            ) : (
                                <p style={{ fontSize: '12px', color: '#666' }}>No hay colaboradores</p>
                            )}
                        </div>
                    </div>

                    <div className="side-section">
                        <h3>Lenguaje</h3>
                        <div className="lang-row">
                            <span>Other</span>
                            <span>100%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}