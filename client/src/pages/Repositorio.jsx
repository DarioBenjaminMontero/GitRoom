import { useCallback, useEffect, useState } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";
import './Repositorio.css';

export default function Repositorio() {
    const [nombreRepo, setNombreRepo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fecha, setFecha] = useState('');
    const [privado, setPrivado] = useState(false);
    const [colaboradores, setColaboradores] = useState([]);
    const { idRepo } = useParams();

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

            console.log("Colaboradores recibidos:", respuesta.data);
            setColaboradores(respuesta.data || []);
        } catch (error) {
            console.error("Error al traer colaboradores:", error.response?.data || error.message);
        }
    }, [idRepo]);

    useEffect(() => {
        if (idRepo) {
            // These async requests update state only after their API responses arrive.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            traerInformacionRepositorio();
            traerColaboradores();
        }
    }, [idRepo, traerInformacionRepositorio, traerColaboradores]);

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
                    <button>Add file ▾</button>
                    <button className="btn-green">&lt;&gt; Code ▾</button>
                </div>
            </div>

            {/* Main Container */}
            <div className="repo-container">
                {/* Left Side: Files & Readme */}
                <div className="repo-main">
                    <div className="box">
                        <div className="box-header purple">
                            <div>
                                <img src="https://via.placeholder.com/24" alt="User" />
                                <strong>Persona2</strong> Add files via upload
                            </div>
                            <div>67 minutes ago • <strong>2 Commits</strong></div>
                        </div>
                        <div className="box-body gray"></div>
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