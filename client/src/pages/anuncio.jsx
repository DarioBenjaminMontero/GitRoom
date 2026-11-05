import { useState, useEffect } from "react";
import axios from "axios";
import "./clases.css";

// Tipos de publicación que piden subir archivos.
const tiposConEntrega = new Set(["tarea", "prueba", "cuestonario"]);

export default function InfoAnuncio({ refreshTrigger }) {
    const token = localStorage.getItem('token');
    const idAnuncio = localStorage.getItem('idanuncio');
    const [tareas,settarea]=useState(false);
    const [anuncio, setAnuncio] = useState(null);
    const [esProfesor, setEsProfesor] = useState(false);
    const [archivos, setArchivos] = useState([]);
    const [comentarios, setComentarios] = useState([]);
    const [textoComentario, setTextoComentario] = useState("");
    const [errorComentarios, setErrorComentarios] = useState("");

    const fetchComentarios = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/clases/anuncios/${idAnuncio}/comentarios`, {
                headers: { authorization: token }
            });
            setComentarios(response.data.comentarios);
            setErrorComentarios("");
        } catch (error) {
            console.error('Error al buscar comentarios', error.response?.data || error.message);
            setErrorComentarios(error.response?.data?.message || "No se pudieron cargar los comentarios.");
        }
    };

    const EnviarComentario = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:3000/clases/anuncios/${idAnuncio}/comentarios`, {
                texto: textoComentario
            }, {
                headers: { authorization: token }
            });
            setTextoComentario("");
            await fetchComentarios();
        } catch (error) {
            console.error('Error al crear el comentario', error.response?.data || error.message);
            setErrorComentarios(error.response?.data?.message || "No se pudo publicar el comentario.");
        }
    };

    useEffect(() => {
        if (token && idAnuncio) {
            fetchDetallesAnuncio();
            fetchComentarios();
        } else {
            console.warn("Falta el token o el idAnuncio en el localStorage");
        }
    }, [token, idAnuncio, refreshTrigger]);

    const tarea = async()=>{
        if(tareas){
            settarea(false)
               try {
            const response = await axios.post(`http://localhost:3000/clases/anuncios/entregar/${idAnuncio}`, {}, {
                headers: {
                    authorization: token
                }
            });

            if (response.data && response.data.anuncio) {
                setAnuncio(response.data.anuncio);
                setEsProfesor(response.data.esProfesor === true);
            } else {
                setAnuncio(null); 
            }

        } catch (error) {
            console.error('Error al buscar detalles del anuncio', error.response?.data || error.message);
            setAnuncio(null);
        }
        }
        else {
            settarea(true)
               try {
            const response = await axios.put(`http://localhost:3000/clases/anuncios/anular/${idAnuncio}`, {}, {
                headers: {
                    authorization: token
                }
            });

            if (response.data && response.data.anuncio) {
                setAnuncio(response.data.anuncio);
                setEsProfesor(response.data.esProfesor === true);
            } else {
                setAnuncio(null); 
            }

        } catch (error) {
            console.error('Error al buscar detalles del anuncio', error.response?.data || error.message);
            setAnuncio(null);
        }
        }
    }
    const fetchDetallesAnuncio = async () => {
        try {
            const response = await axios.post(`http://localhost:3000/clases/anunci/${idAnuncio}`, {}, {
                headers: {
                    authorization: token
                }
            });

            if (response.data && response.data.anuncio) {
                setAnuncio(response.data.anuncio);
                setEsProfesor(response.data.esProfesor === true);
            } else {
                setAnuncio(null); 
            }

        } catch (error) {
            console.error('Error al buscar detalles del anuncio', error.response?.data || error.message);
            setAnuncio(null);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '24px', maxWidth: '1000px', margin: '0 auto', padding: '20px', alignItems: 'flex-start' }} className="anuncio-detalle-container">
            {anuncio ? (
                <>
                    {/* Columna Izquierda: Información del Anuncio y Comentarios */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }} className="anuncio-main-content">
                        <div className="anuncio-header-flex">
                            <div>
                                <h2>{anuncio.nombre}</h2>
                                <div className="anuncio-meta">
                                    <span>{anuncio.tipo || "Publicación"}</span>
                                    <span>{anuncio.fecha_publicacion ? new Date(anuncio.fecha_publicacion).toLocaleDateString() : ""}</span>
                                </div>
                            </div>
                        </div>

                        <hr className="anuncio-divider" />

                        <div className="anuncio-body-texto">
                            <p>{anuncio.contenido}</p>
                        </div>

                        <hr className="anuncio-divider" />

                        <section className="comentarios-seccion">
                            <h3>Comentarios</h3>

                            {comentarios.length > 0 ? (
                                <ul className="comentarios-lista">
                                    {comentarios.map((comentario) => (
                                        <li key={comentario.id_comentario} className="comentario">
                                            <div className="comentario-meta">
                                                <strong>{comentario.autor.nombre} {comentario.autor.apellido}</strong>
                                                <span>{new Date(comentario.fecha_comentario).toLocaleDateString()}</span>
                                            </div>
                                            <p>{comentario.texto}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                !errorComentarios && <p className="comentarios-vacio">Todavía no hay comentarios.</p>
                            )}

                            {errorComentarios && <p className="comentarios-error" role="alert">{errorComentarios}</p>}

                            <form className="comentario-form" onSubmit={EnviarComentario}>
                                <textarea
                                    aria-label="Escribir un comentario"
                                    placeholder="Escribe un comentario..."
                                    rows={2}
                                    value={textoComentario}
                                    onChange={(e) => setTextoComentario(e.target.value)}
                                />
                                <button type="submit" disabled={!textoComentario.trim()}>
                                    Comentar
                                </button>
                            </form>
                        </section>
                    </div>

                    {/* Columna Derecha: Tarjeta "Tu trabajo" con diseño oscuro */}
                    {!esProfesor && (
                        <div style={{ width: '320px' }}>
                            <div style={{ backgroundColor: '#1f1f33', padding: '24px 20px', borderRadius: '16px', border: '1px solid #2e2e48', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', color: '#ffffff', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 500, margin: 0, color: '#ffffff' }}>Tu trabajo</h2>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#b0b0d0' }}>Asignado</span>
                                </div>

                                <label style={{ display: 'block', width: '100%', marginBottom: '16px', cursor: 'pointer' }}>
                                    <input
                                        type="file"
                                        multiple
                                        style={{ display: 'none' }}
                                        onChange={(e) => setArchivos(Array.from(e.target.files))}
                                    />
                                    <div style={{ width: '100%', backgroundColor: 'transparent', color: '#6c8dff', border: '1px solid #6c8dff', borderRadius: '20px', padding: '10px 16px', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxSizing: 'border-box' }}>
                                        <svg 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round"
                                            width="18"
                                            height="18"
                                        >
                                            <line x1="12" y1="5" x2="12" y2="19" />
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                        Añadir o crear
                                    </div>
                                </label>

                                {archivos.length > 0 && (
                                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0', fontSize: '0.85rem', color: '#d0d0e0' }}>
                                        {archivos.map((archivo, index) => (
                                            <li key={`${archivo.name}-${index}`} style={{ padding: '4px 0', borderBottom: '1px solid #2e2e48' }}>{archivo.name}</li>
                                        ))}
                                    </ul>
                                )}
                                {tareas&&(
                                <button onClick={tarea} style={{ width: '100%', backgroundColor: '#3b52d4', color: '#ffffff', border: 'none', borderRadius: '20px', padding: '12px 16px', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', boxSizing: 'border-box' }}>
                                    Marcar como completado
                                </button>)}
                                {!tareas&&(<button onClick={tarea} style={{ width: '100%', backgroundColor: '#3b52d4', color: '#ffffff', border: 'none', borderRadius: '20px', padding: '12px 16px', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', boxSizing: 'border-box' }}>
                                    Anular entrega
                                </button>)}
                                
                            </div>
                        </div>
                    )}
                    {esProfesor&&(
                        <div></div>
                    )}
                </>
            ) : (
                <p style={{ textAlign: "center", width: "100%", color: "#9aa0a6" }}>Cargando información del anuncio...</p>
            )}
        </div>
    );
}