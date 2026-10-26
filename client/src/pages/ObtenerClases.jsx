import { useState, useEffect } from "react";
import axios from "axios";


export default function ClasesList() {

    const token = localStorage.getItem('token')

    const [clases, setClases] = useState([])
    // Guarda la página visible; empieza en 1 y se actualiza desde los botones.
    const [paginaActual, setPaginaActual] = useState(1);

    // Cantidad máxima de clases que se muestran en cada página.
    const clasesPorPagina = 6;
    // Divide la cantidad de clases por página y redondea hacia arriba
    // para contar también la última página aunque quede incompleta.
    const totalPaginas = Math.ceil(clases.length / clasesPorPagina);
    // Calcula el índice inicial del arreglo para la página actual (índices desde 0).
    const inicio = (paginaActual - 1) * clasesPorPagina;
    // Toma solo las clases de esta página; el índice final de slice no se incluye.
    const clasesVisibles = clases.slice(inicio, inicio + clasesPorPagina);

    useEffect(() => {
        if (token) {
            fecthClases();
        }
    }, [token]);



    if (!token) return alert("Debes estar logueado para ver tus clases");

    const fecthClases = async () => {
        try {
            const response = await axios.get('http://localhost:3000/users/clases', {
                headers: {
                    authorization: token
                }


            })

            console.log("Respuesta del Backend:", response.data);

            // Si la API devuelve los datos dentro de un objeto, por ejemplo { clases: [...] }
            if (Array.isArray(response.data)) {
                setClases(response.data);
            } else if (Array.isArray(response.data.clases)) {
                setClases(response.data.clases);
            } else {
                setClases([]); // Mantiene el array vacío si la respuesta no es un arreglo
            }

        } catch (error) {
            console.error('Error al buscar las clases');
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Tus Clases</h2>

            {clases.length > 0 ? (
    <>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {/* Renderiza únicamente las clases seleccionadas para esta página. */}
            {clasesVisibles.map((clase, index) => {
                const profesor = clase.usuarios && clase.usuarios.length > 0
                    ? `${clase.usuarios[0].nombre} ${clase.usuarios[0].apellido}`
                    : "Profesor no asignado";

                return (
                    <div
                        key={clase.id_clase || index}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "16px",
                            width: "220px"
                        }}
                    >
                        <h3>{clase.nombreClase}</h3>
                        <p style={{ color: "#666", fontSize: "14px" }}>
                            Creado por: {profesor}
                        </p>
                    </div>
                );
            })}
        </div>

        {/* Muestra la navegación solo cuando existe más de una página. */}
        {totalPaginas > 1 && (
            <div>
                {/* Retrocede una página; se desactiva al llegar a la primera. */}
                <button
                    onClick={() => setPaginaActual((pagina) => pagina - 1)}
                    disabled={paginaActual === 1}
                >
                    Anterior
                </button>

                <span> Página {paginaActual} de {totalPaginas} </span>

                {/* Avanza una página; se desactiva al llegar a la última. */}
                <button
                    onClick={() => setPaginaActual((pagina) => pagina + 1)}
                    disabled={paginaActual === totalPaginas}
                >
                    Siguiente
                </button>
            </div>
        )}
    </>
) : (
    <p>No estás inscripto en ninguna clase todavía.</p>
)}
        </div>
    );
}