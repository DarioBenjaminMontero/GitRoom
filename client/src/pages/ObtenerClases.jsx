import { useState, useEffect } from "react";
import axios from "axios";


export default function  ClasesList() {

    const token = localStorage.getItem('token')
    
    const [clases, setClases] = useState([])

    useEffect(() => {
        if (token) {
            fecthClases();
        }
    }, [token]);

    

    if (!token) return alert ("Debes estar logueado para ver tus clases");

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
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                    {clases.map((clase, index) => {
                        // Extraemos el primer profesor asignado a la clase (si existe)
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
            ) : (
                <p>No estás inscripto en ninguna clase todavía.</p>
            )}
        </div>
    );

}