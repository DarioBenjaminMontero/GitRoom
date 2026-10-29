import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./clases.css"; 

export default function Obteneranuncios({ refreshTrigger }) {
    const token = localStorage.getItem('token');
    const idClase = localStorage.getItem('idclase');
    const [anucios, setanuncio] = useState([]);
    const [imagen, setimagen] = useState("");
    
    // Estados para el modal de Crear Anuncio
    const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
    const [nombre,setnombre]=useState("")
    const [contenido, setContenido] = useState("");
    const [tipo, setTipo] = useState("anuncio"); 
    
    const navigate = useNavigate();

    useEffect(() => {
        if (token && idClase) {
            fetchImgClase();
            fecthanunaios();
        } else {
            console.warn("Falta el token o el idclase en el localStorage");
        }
    }, [token, idClase, refreshTrigger]);

    const Anuncio = async (id_anuncio) => {
        localStorage.setItem('idanuncio', id_anuncio);
        navigate("/anuncio");
    };

    // Función de tiempo transcurrido corregida y completa
    const calcularTiempoTranscurrido = (fechaString) => {
        if (!fechaString) return "";
        const fechaPub = new Date(fechaString);
        const hoy = new Date();
        
        const diferenciaMs = hoy - fechaPub;
        const diferenciaDias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));

        if (diferenciaDias === 0) {
            return "Hoy";
        } else if (diferenciaDias === 1) {
            return "Ayer";
        } else if (diferenciaDias < 30) {
            return `Hace ${diferenciaDias} días`;
        } else {
            const anosDiferencia = hoy.getFullYear() - fechaPub.getFullYear();
            const mesesDiferencia = (hoy.getFullYear() - fechaPub.getFullYear()) * 12 + (hoy.getMonth() - fechaPub.getMonth());

            if (anosDiferencia >= 1) {
                return anosDiferencia === 1 ? "Hace 1 año" : `Hace ${anosDiferencia} años`;
            } else if (mesesDiferencia >= 1) {
                return mesesDiferencia === 1 ? "Hace 1 mes" : `Hace ${mesesDiferencia} meses`;
            } else {
                return fechaPub.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
            }
        }
    };

    const handleCrearAnuncio = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        try {
            // Ajusta la ruta de la API según cómo la tengas en tu backend para crear anuncios
            await axios.post(`http://localhost:3000/clases/${idClase}/anuncios`, { 
                contenido: contenido,
                tipo: tipo,
                nombre:nombre 
            }, {
                headers: { authorization: token }
            });

            alert("Anuncio creado con éxito");
            setModalCrearAbierto(false);
            setContenido('');
            setTipo('anuncio');
            
            // Recargamos la lista de anuncios para que aparezca el nuevo al instante
            await fecthanunaios();
            
        } catch (error) {
            console.error("Error al crear el anuncio:", error.response?.data || error.message);
            alert("Hubo un error al crear el anuncio.");
        }
    };

    const fetchImgClase = async () => {
        try {
            const response = await axios.post(`http://localhost:3000/clases/anun/${idClase}`, {}, {
                headers: { authorization: token }
            });

            if (response.data && response.data.imagen) {
                setimagen(response.data.imagen.imagen);
            } else {
                setimagen(""); 
            }
        } catch (error) {
            console.error('Error al buscar la imagen de la clase', error.response?.data || error.message);
            setimagen("");
        }
    };

    const fecthanunaios = async () => {
        try {
            const response = await axios.post(`http://localhost:3000/clases/anuncio/${idClase}`, {}, {
                headers: { authorization: token }
            });

            if (response.data && Array.isArray(response.data.anuncio)) {
                setanuncio(response.data.anuncio);
            } else if (Array.isArray(response.data)) {
                setanuncio(response.data);
            } else {
                setanuncio([]); 
            }
        } catch (error) {
            console.error('Error al buscar anuncios de la clase', error.response?.data || error.message);
            setanuncio([]);
        }
    };

    return (
        <div className="anuncios-container">
            {imagen && (
                <div className="clase-banner">
                    <img src={imagen} alt="Banner de la clase" style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px" }} />
                </div>
            )}
            
            <div className="anuncios-grid">
                {/* Botón que abre el modal */}
                <button className="btn-nuevo-anuncio" onClick={() => setModalCrearAbierto(true)}>
                    + Nuevo Anuncio
                </button>

                {anucios.length > 0 ? (
                    anucios.map((anuncio, index) => (
                        <div
                            key={anuncio.id_anuncio || index}
                            className="anuncio-card"
                            role="button" 
                            onClick={() => Anuncio(anuncio.id_anuncio)}
                        >
                            <div className="anuncio-content">
                                <span className="anuncio-tipo">
                                    {anuncio.nombre}
                                </span>
                                <span className="anuncio-fecha" style={{ fontSize: "12px", color: "#b0b0d0", marginTop: "4px", display: "block" }}>
                                    {calcularTiempoTranscurrido(anuncio.fecha_publicacion)}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="anuncios-vacio">No hay anuncios cargados en esta clase.</p>
                )}
            </div>

            {/* --- MODAL PARA CREAR ANUNCIO --- */}
            {modalCrearAbierto && (
                <div className="modal-overlay">
                    <div className="modal-contenido">
                        <h2>Crear un nuevo anuncio</h2>
                        
                        <div className="modal-seccion">
                            <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}>Tipo</label>
                            <input
                                type="text"
                                placeholder="Ej: Anuncio, Tarea, Material"
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                            />
                        </div>
                        <div className="modal-seccion">
                            <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}>Titulo</label>
                            <input
                                type="text"
                                placeholder="Ej: actividad N°1,TP N°1"
                                value={nombre}
                                onChange={(e) => setnombre(e.target.value)}
                            />
                        </div>

                        <div className="modal-seccion">
                            <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}>Contenido del anuncio</label>
                            <input
                                type="text"
                                placeholder="Escribe tu mensaje aquí..."
                                value={contenido}
                                onChange={(e) => setContenido(e.target.value)}
                            />
                        </div>

                        <div className="modal-botones">
                            <button className="btn-cancelar" onClick={() => setModalCrearAbierto(false)}>Cancelar</button>
                            <button
                                className={`btn-unirse ${contenido.trim() ? 'activo' : ''}`}
                                disabled={!contenido.trim()}
                                onClick={handleCrearAnuncio}
                            >
                                Publicar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}