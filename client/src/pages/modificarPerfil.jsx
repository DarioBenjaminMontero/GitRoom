import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ModificarPerfil() {
    // useState crea una variable de estado y una función para cambiarla.
    // El input modifica el estado mediante setNuevoNombre.
    const [nuevoNombre, setNuevoNombre] = useState("");
    const [nuevoApellido, setNuevoApellido] = useState("");
    const [nuevaContraseña, setNuevaContraseña] = useState("");

    // Obtiene el token de sesión guardado cuando el usuario inició sesión.
    const token = localStorage.getItem("token");
    // Permite cambiar de página mediante React Router.
    const navigate = useNavigate();

    const obtenerTokenModificacion = async () => {
        try {
            // Solicita al backend un token especial para modificar el perfil.
            const response = await axios.get(
                "http://localhost:3000/users/quiereModificarPerfil",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Guarda el token especial recibido para usarlo en los demás pedidos.
            localStorage.setItem(
                "tokenPerfil",
                response.data.tokenPerfil
            );
        } catch (error) {
            console.error("Error al obtener el token de modificación:", error);
        }
    };

    // Ejecuta obtenerTokenModificacion cuando se monta el componente.
    // Los corchetes vacíos indican que solo debe ejecutarse una vez.
    useEffect(() => {
        obtenerTokenModificacion();
    }, []);

    const cambiarNombreYApellido = async (event) => {
        // Evita que el formulario recargue la página normalmente.
        event.preventDefault();

        try {
            await axios.post(
                "http://localhost:3000/users/cambiarNombre",
                {
                    nuevoNombre,
                    nuevoApellido
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        modificar: localStorage.getItem("tokenPerfil")
                    }
                }
            );

            // Lee el usuario guardado al iniciar sesión y lo convierte en objeto.
            const usuario = JSON.parse(localStorage.getItem("user")) || {};

            // Cambia solamente los datos nuevos dentro del objeto existente.
            usuario.username = nuevoNombre;
            usuario.apellido = nuevoApellido;

            // JSON.stringify convierte el objeto en texto para guardarlo.
            localStorage.setItem("user", JSON.stringify(usuario));
            // Informa al Header que el usuario guardado en localStorage cambió.
            window.dispatchEvent(new Event("usuarioActualizado"));

            alert("Nombre y apellido cambiados con éxito");
            navigate("/perfil");
        } catch (error) {
            console.error("Error al cambiar nombre y apellido:", error);
        }
    };

    const cambiarContraseña = async (event) => {
        // Evita que el envío del formulario recargue la página.
        event.preventDefault();

        try {
            await axios.post(
                "http://localhost:3000/users/cambiarContra",
                { nuevaContraseña },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        modificar: localStorage.getItem("tokenPerfil")
                    }
                }
            );

            navigate("/perfil", {
                state: {
                    nombre: nuevoNombre,
                    apellido: nuevoApellido
                }
                // Navega al perfil y lleva datos en el estado de la navegación.
                // Permite mostrarlos sin depender de que la página se recargue.
            });

            alert("Contraseña cambiada con éxito");
        } catch (error) {
            console.error("Error al cambiar la contraseña:", error);
        }
    };

    return (
        <div>
            <h2>Modificar Perfil</h2>

            <form onSubmit={cambiarNombreYApellido}>
                <label>
                    Nuevo Nombre:
                    <input
                        type="text"
                        value={nuevoNombre}
                        onChange={(event) => setNuevoNombre(event.target.value)}
                        placeholder="Ingrese su nuevo nombre"
                        required
                    />
                </label>

                <label>
                    Nuevo Apellido:
                    <input
                        type="text"
                        value={nuevoApellido}
                        onChange={(event) => setNuevoApellido(event.target.value)}
                        placeholder="Ingrese su nuevo apellido"
                        required
                    />
                </label>

                <button type="submit">Cambiar nombre y apellido</button>
            </form>

            <form onSubmit={cambiarContraseña}>
                <label>
                    Nueva Contraseña:
                    <input
                        type="password"
                        value={nuevaContraseña}
                        onChange={(event) => setNuevaContraseña(event.target.value)}
                        placeholder="Ingrese su nueva contraseña"
                        required
                    />
                </label>

                <button type="submit">Cambiar Contraseña</button>
            </form>
        </div>
    );
}

export default ModificarPerfil;