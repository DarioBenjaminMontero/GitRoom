import { useState, useEffect } from "react";
import axios from "axios";
import "./clases.css";

// Tipos de publicación que piden subir archivos.
const tiposConEntrega = new Set(["tarea", "prueba", "cuestonario"]);

export default function InfoAnuncio({ refreshTrigger }) {
    const token = localStorage.getItem('token');
    const idAnuncio = localStorage.getItem('idanuncio');
    
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
        <div className="anuncio-detalle-container">
            {anuncio ? (
                <>
                    {/* Columna Izquierda: Información del Anuncio/Tarea */}
                    <div className="anuncio-main-content">
                        <div className="anuncio-header-flex">
                            <div>
                                <h2>{anuncio.nombre}</h2>
                                <div className="anuncio-meta">
                                    <span>{anuncio.tipo || "Publicación"}</span> • <span>{anuncio.fecha_publicacion ? new Date(anuncio.fecha_publicacion).toLocaleDateString() : ""}</span>
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

                    {/* Columna Derecha: Entrega del alumno. No afecta a los archivos que el profesor adjunta a la tarea. */}
                    {!esProfesor && tiposConEntrega.has(anuncio.tipo) && (
                        <aside className="entrega-cuadro">
                            <h3>Tu entrega</h3>
                            <label className="entrega-selector">
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => setArchivos(Array.from(e.target.files))}
                                />
                                + Agregar archivos
                            </label>
                            {archivos.length > 0 && (
                                <ul className="entrega-lista">
                                    {archivos.map((archivo, index) => (
                                        <li key={`${archivo.name}-${index}`}>{archivo.name}</li>
                                    ))}
                                </ul>
                            )}
                        </aside>
                    )}
                </>
            ) : (
                <p style={{ textAlign: "center", width: "100%", color: "#9aa0a6" }}>Cargando información del anuncio...</p>
            )}
        </div>
    );
}