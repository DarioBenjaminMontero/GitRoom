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
    const [miEntrega, setMiEntrega] = useState(null);
    const [subiendoEntrega, setSubiendoEntrega] = useState(false);
    const [errorEntrega, setErrorEntrega] = useState("");

    const fetchMiEntrega = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/clases/anuncios/${idAnuncio}/entregas/mia`, {
                headers: { authorization: token }
            });
            setMiEntrega(response.data.entrega);
        } catch (error) {
            console.error('Error al buscar la entrega', error.response?.data || error.message);
            setErrorEntrega(error.response?.data?.message || "No se pudo cargar tu entrega.");
        }
    };

    const agregarArchivos = (e) => {
        const nuevos = Array.from(e.target.files);
        setArchivos((actuales) => [...actuales, ...nuevos]);
        // Permite volver a elegir el mismo archivo después de quitarlo.
        e.target.value = "";
    };

    const quitarArchivo = (indice) => {
        setArchivos((actuales) => actuales.filter((_, i) => i !== indice));
    };

    const enviarEntrega = async () => {
        const datos = new FormData();
        archivos.forEach((archivo) => datos.append("archivos", archivo));

        setSubiendoEntrega(true);
        setErrorEntrega("");
        try {
            await axios.post(`http://localhost:3000/clases/anuncios/${idAnuncio}/entregas`, datos, {
                headers: { authorization: token }
            });
            setArchivos([]);
            await fetchMiEntrega();
        } catch (error) {
            console.error('Error al enviar la entrega', error.response?.data || error.message);
            setErrorEntrega(error.response?.data?.message || "No se pudo enviar la entrega.");
        } finally {
            setSubiendoEntrega(false);
        }
    };

    const descargarArchivo = async (archivo) => {
        setErrorEntrega("");
        try {
            const response = await axios.get(`http://localhost:3000/clases/entregas/archivos/${archivo.id_archivo_entrega}`, {
                headers: { authorization: token },
                responseType: "blob"
            });
            const url = URL.createObjectURL(response.data);
            const enlace = document.createElement("a");
            enlace.href = url;
            enlace.download = archivo.nombre_original;
            enlace.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al descargar el archivo', error.message);
            setErrorEntrega("No se pudo descargar el archivo.");
        }
    };

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
            fetchMiEntrega();
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

                            {miEntrega && (
                                <div className="entrega-actual">
                                    <p className="entrega-estado">
                                        Entregado el {new Date(miEntrega.fecha_entrega).toLocaleDateString()}
                                    </p>
                                    {miEntrega.calificacion !== null && (
                                        <p className="entrega-estado">Calificación: {miEntrega.calificacion}</p>
                                    )}
                                    <ul className="entrega-lista">
                                        {miEntrega.archivos.map((archivo) => (
                                            <li key={archivo.id_archivo_entrega}>
                                                <button
                                                    type="button"
                                                    className="entrega-descarga"
                                                    onClick={() => descargarArchivo(archivo)}
                                                >
                                                    {archivo.nombre_original}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {miEntrega?.calificacion == null && (
                                <>
                                    <label className="entrega-selector">
                                        <input type="file" multiple onChange={agregarArchivos} />
                                        + Agregar archivos
                                    </label>

                                    {archivos.length > 0 && (
                                        <ul className="entrega-lista">
                                            {archivos.map((archivo, index) => (
                                                <li key={`${archivo.name}-${index}`}>
                                                    <span>{archivo.name}</span>
                                                    <button
                                                        type="button"
                                                        className="entrega-quitar"
                                                        aria-label={`Quitar ${archivo.name}`}
                                                        onClick={() => quitarArchivo(index)}
                                                    >
                                                        ×
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {miEntrega && archivos.length > 0 && (
                                        <p className="entrega-aviso">Estos archivos reemplazan a tu entrega anterior.</p>
                                    )}

                                    <button
                                        type="button"
                                        className="entrega-enviar"
                                        disabled={archivos.length === 0 || subiendoEntrega}
                                        onClick={enviarEntrega}
                                    >
                                        {subiendoEntrega ? "Subiendo..." : miEntrega ? "Volver a entregar" : "Entregar"}
                                    </button>
                                </>
                            )}

                            {errorEntrega && <p className="entrega-error" role="alert">{errorEntrega}</p>}
                        </aside>
                    )}
                </>
            ) : (
                <p style={{ textAlign: "center", width: "100%", color: "#9aa0a6" }}>Cargando información del anuncio...</p>
            )}
        </div>
    );
}