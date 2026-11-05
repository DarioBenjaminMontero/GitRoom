import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, Link, useParams} from "react-router-dom"; // 1. Agregado Link aquí
import "./Perfil.css";
function Perfil() {
    const {id} = useParams();
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
const [imagen, setImagen] = useState('');
    const [repos, setRepos] = useState([]);
    const [clases, setClases] = useState([]);
    const token = localStorage.getItem('token');
    const usuarioGuardado = JSON.parse(localStorage.getItem('user')); //
const esMiPerfil = !id || String(id) === String(usuarioGuardado?.id); //
const [archivo, setArchivo] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();
    // Controla si se muestra el formulario de confirmación.
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    // Guarda la contraseña que el usuario escribe para confirmar la eliminación.
    const [contraseñaEliminacion, setContraseñaEliminacion] = useState('');
    

    const handleFileChange = (e) => {
        setArchivo(e.target.files[0]);
    };

    const handleSubirImagen = async (e) => {
        e.preventDefault();

        if (!archivo) {
            setMensaje('Por favor selecciona una imagen.');
            return;
        }

        const formData = new FormData();
        formData.append('imagen', archivo);

        try {
            const response = await axios.post('http://localhost:3000/users/uploadImage', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setMensaje('¡Imagen subida con éxito!');
            console.log(response.data);
            
            // Opcional: Actualizar la imagen en pantalla automáticamente si el backend devuelve la nueva ruta
            if(response.data.filename) {
                setImagen(`http://localhost:3000/uploads/${response.data.filename}`);
            }
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            setMensaje(error.response?.data?.message || 'Hubo un error al subir la imagen.');
        }
    };

        const borrarCuenta = async (event) => {
            // Evita que el formulario recargue la página al enviarse.
            event.preventDefault();

            // No permite ejecutar la eliminación si falta la contraseña.
            if (!contraseñaEliminacion) {
                alert("Ingresá tu contraseña para confirmar.");
                return;
            }

            try {
                // axios.delete debe enviar datos con la propiedad data en el tercer parametro.
                await axios.delete('http://localhost:3000/users/borrarCuenta', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    data: {
                        contraseña: contraseñaEliminacion
                    }
                });

                // La cuenta fue eliminada, por eso se borra toda la sesión guardada.
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('tokenPerfil');
                localStorage.removeItem('idclase');
                // Informa al Header que cambió el usuario guardado.
                window.dispatchEvent(new Event("usuarioActualizado"));

                alert("Cuenta eliminada con éxito");
                navigate("/login");
            } catch (error) {
                alert(error.response?.data?.message || "No se pudo eliminar la cuenta.");
            }
        };

        const cerrarConfirmacion = () => {
            // Oculta el modal y elimina la contraseña escrita al cancelarlo.
            setMostrarConfirmacion(false);
            setContraseñaEliminacion('');
        };
        const ConseguirDatosUsuario = async () => {
            try {
                const url = id
            ? `http://localhost:3000/users/perfil/${id}` //if
            : `http://localhost:3000/users/obtenerdatos`;
        const respuesta = await axios.get(url,  {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });


                setNombre(respuesta.data.nombre);
                setDescripcion(respuesta.data.mail);
                setImagen(`http://localhost:3000/uploads/${respuesta.data.foto_perfil}`);
                console.log(imagen)
            }
            catch (error) {
                console.log(error);
            }
        };

        const traerRepositorios = async () => { 
              const url = id
            ? `http://localhost:3000/repositorios/traerReposUsers/${id}` //if
            : `http://localhost:3000/repositorios/traerRepos`;
            try {
                const response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setRepos(response.data);
            }
            catch (error) {
                console.error("Error al traer los repositorios:", error);
            }
        };

        const fetchClases = async () => {

            const url = id
            ? `http://localhost:3000/users/clases/${id}` //if
            : `http://localhost:3000/users/clases`;
            try {
                const response = await axios.get(url, {
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
        }, [id]);

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
    {esMiPerfil && (
        <>
            <form id="avatarForm" onSubmit={handleSubirImagen}>
                <input type="file" id="imagenInput" name="imagen" accept="image/*" onChange={handleFileChange} required />
                <button type="submit">Subir Imagen</button>
            </form>
            {mensaje && <p>{mensaje}</p>}
        </>
    )}
    <h3>{nombre}</h3>
    <h4>{descripcion}</h4>
    {esMiPerfil && (
        <>
            <button onClick={() => navigate("/modificarPerfil")}>Editar usuario</button>
            {/* Cambiar true muestra el modal de confirmación. */}
            <button
                type="button"
                className="boton-eliminar-cuenta"
                onClick={() => setMostrarConfirmacion(true)}
            >
                Borrar cuenta
            </button>
        </>
    )}
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

                {mostrarConfirmacion && (
                    <div className="modal-eliminar-cuenta">
                        {/* Al enviar el formulario se ejecuta borrarCuenta. */}
                        <form
                            className="confirmacion-eliminar-cuenta"
                            onSubmit={borrarCuenta}
                        >
                            <h3>Confirmar eliminación</h3>
                            <p>Esta acción eliminará definitivamente tu cuenta.</p>

                            {/* El valor escrito actualiza contraseñaEliminacion. */}
                            <input
                                type="password"
                                value={contraseñaEliminacion}
                                onChange={(event) => setContraseñaEliminacion(event.target.value)}
                                placeholder="Ingresá tu contraseña"
                                required
                            />

                            <div>
                                <button type="submit" className="boton-confirmar-eliminacion">
                                    Eliminar cuenta
                                </button>
                                <button type="button" onClick={cerrarConfirmacion}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </>
        );
    }
export default Perfil;
