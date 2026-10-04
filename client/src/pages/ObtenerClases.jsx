import { useState, useEffect } from "react";
import axios from "axios";


export default function  ClasesList() {

    const [clases, setClases] = useState([])

    useEffect(() => {
        fecthClases()
    }, [])

    const token = localStorage.getItem('token')

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

    return  (
        <>
            <h2>Tus Clases</h2>
            {clases && clases.length !== 0 ? <ul>
                {
                clases.map((clase) => {
                    return (
                    <li>
                        {clase.nombreClase}
                    </li>
                    )
                })
                
            }

            </ul>:<h2></h2>}

            

        </>
    )
}