import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register(){

const [nombre, setNombre] = useState("")
const [contraseña, setContraseña] = useState("")
const [año_division, setAño_Division] = useState("")
const [apellido, setApellido] = useState("")
const [mail, setMail] = useState("")
const navigate = useNavigate();

const registro = async(e) =>{
e.preventDefault()
const nuevoUsuario = {
nombre,
contraseña,
año_division,
apellido,
mail
}

try{

const response = await axios.post("http://localhost:3000/users/register/",nuevoUsuario)
alert("exito")
navigate("/login")
}
catch(error){
alert("error al registrarse: " + (error.response?.data?.message || error.message))
}

}


return (
<>

<form onSubmit={registro} className = "register-form">
<input type= "name" onChange={(e) => setNombre(e.target.value)}>
</input>
<input type= "email" onChange={(e) => setMail(e.target.value)}>
</input>
<input type= "año_division" onChange={(e) => setAño_Division(e.target.value)}>
</input>
<input type= "password" onChange={(e) => setContraseña(e.target.value)}>
</input>
<input type= "appelido" onChange={(e) => setApellido(e.target.value)}>
</input>
<button type="submit" className="ingresar-button">
              Ingresar
            </button>
            </form>
</>
);



}