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
    const navigate = useNavigate();

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

    // <--- Nueva función para traer los archivos del repositorio
    const traerArchivos = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const respuesta = await axios.get(`http://localhost:3000/archivos/repositorio/${idRepo}/traerArchivos`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setArchivos(respuesta.data || []);
        } catch (error) {
            console.error("Error al traer archivos:", error.response?.data || error.message);
        }
    }, [idRepo]);

    useEffect(() => {
        if (idRepo) {
            traerInformacionRepositorio();
            traerColaboradores();
            traerArchivos(); // <--- Llamamos a la función al cargar el componente
        }
    }, [idRepo, traerInformacionRepositorio, traerColaboradores, traerArchivos]);

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
                    
                    {/* Caja de Archivos del Repositorio */}
                    <div className="box">
                        <div className="box-header purple">
                            <div>
                                <img src="https://via.placeholder.com/24" alt="User" />
                                <strong>Archivos del Repositorio</strong>
                            </div>
                            <div>{archivos.length} archivo(s)</div>
                        </div>
                        <div className="box-body" style={{ padding: '16px', background: '#fff' }}>
                            {archivos.length === 0 ? (
                                <p style={{ color: '#666', fontSize: '14px' }}>Este repositorio todavía no tiene archivos subidos.</p>
                            ) : (
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {archivos.map((archivo) => (
                                        <li key={archivo.id_archivo} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eaeaea' }}>
                                            <span>📄 {archivo.nombre}</span>
                                            <a 
                                                href={archivo.urlCompleta} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                style={{ color: '#0969da', textDecoration: 'none', fontWeight: '500' }}
                                            >
                                                Ver / Descargar
                                            </a>
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