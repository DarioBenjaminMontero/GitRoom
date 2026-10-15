import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";


function Perfil() {

    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [imagen, setImagen] = useState('')

    const [repos, setRepos] = useState([])
    const [clases, setClases] = useState([])
    const token = localStorage.getItem('token')
    const ConseguirDatosUsuario = async () => {
        const usuario = JSON.parse(localStorage.getItem('user'));
        const id = usuario.id;
        try {

            const respuesta = await axios.get(`http://localhost:3000/users/obtenerdatos`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setNombre(respuesta.data.nombre);
            setDescripcion(respuesta.data.mail);
            setImagen(respuesta.data.foto_perfil);


        }
        catch (error) {

            console.log(error)
        }
    }

    useEffect(() => {
        ConseguirDatosUsuario();
    }, []);

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

            </div>

            <div id="clasesRecientes">

            </div>

        </div>
    </>

    )
    

}

export default Perfil;