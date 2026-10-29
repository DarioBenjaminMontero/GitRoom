import { useState, useEffect } from "react";
import axios from "axios";
import "./clases.css"; 

export default function InfoAnuncio({ refreshTrigger }) {
    const token = localStorage.getItem('token');
    const idAnuncio = localStorage.getItem('idanuncio');
    
    const [anuncio, setAnuncio] = useState(null);

    useEffect(() => {
        if (token && idAnuncio) {
            fetchDetallesAnuncio();
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
                    </div>
                </>
            ) : (
                <p style={{ textAlign: "center", width: "100%", color: "#9aa0a6" }}>Cargando información del anuncio...</p>
            )}
        </div>
    );
}