import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom"; // 1. Agregado Link aquí
import "./Perfil.css";
function Perfil() {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagen, setImagen] = useState('');

    const [repos, setRepos] = useState([]);
    const [clases, setClases] = useState([]);
    const token = localStorage.getItem('token');

    const ConseguirDatosUsuario = async () => {
        try {
            const respuesta = await axios.get(`http://localhost:3000/users/obtenerdatos`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setNombre(respuesta.data.nombre);
            setDescripcion(respuesta.data.mail);
            setImagen(respuesta.data.foto_perfil);
        }
        catch (error) {
            console.log(error);
        }
    };

    const traerRepositorios = async () => {
        try {
            const response = await axios.get("http://localhost:3000/repositorios/traerRepos", {
                headers: { Authorization: `Bearer ${token}` }
            });
           
            setRepos(response.data);
        }
        catch (error) {
            console.error("Error al traer los repositorios:", error);
        }
    };

const fetchClases = async () => {
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
            return
        }
    };

    // 2. Ejecutamos ambas funciones al cargar el componente
    useEffect(() => {
        ConseguirDatosUsuario();
        traerRepositorios();
        fetchClases();
    }, []);

    // 3. Calculamos los recientes directamente a partir del estado `repos`
    // (se recalculará automáticamente cada vez que `repos` cambie)
    const recientes = [...repos]
        .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
        .slice(0, 3);


        const recientesClases = [...clases]
        .sort((a, b) => new Number(b.id_clase) - new Number(a.id_clase))
        .slice(0, 3);
        console.log(clases)

    return (
        <>
            <div id="envoltura">
                <div id="informacionUsuario">
                    <img
                        id="imagenDePerfil"
                        src={imagen}
                        alt="Foto de perfil"
                    />
                    <h3>
                        {nombre}
                    </h3>
                    <h4>
                        {descripcion}
                    </h4>
                    <button>
                        Editar usuario
                    </button>
                </div>

                <div id="reposRecientes">
                    {recientes.length === 0 ? (
                        <p className="sidebar-mensaje">Cuando crees un repositorio, va a aparecer acá.</p>
                    ) : (
                        recientes.map((repo) => (
                            <div className="tarjeta-repo" key={repo.id_repo}>
                                <Link to={`/repositorios/${repo.id_repo}`} style={{ color: "#b794f6" }}>
                                    {repo.nombre_repo}
                                </Link>
                                <span className="etiqueta">{repo.es_privado ? "Privado" : "Público"}</span>
                                <p>{repo.descripcion || "Sin descripción"}</p>
                            </div>
                        ))
                    )}
                </div>

                <div id="clasesRecientes">
                    {recientesClases.length === 0 ? (
                        <p className="sidebar-mensaje">Cuando crees una clase, va a aparecer acá.</p>
                    ) : (
                        recientesClases.map((clase) => (
                            <div className="tarjeta-repo" key={clase.id_clase}>
                                <Link to={`/clases/${clase.id_clase}`} style={{ color: "#b794f6" }}>
                                    {clase.nombreClase}
                                </Link>
                                <span className="etiqueta">{clase.codigo}</span>
                               
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

export default Perfil;
