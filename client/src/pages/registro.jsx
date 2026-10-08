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
const letras=/^[a-zA-Z0-9.#$\_\-]+$/
const verificarmail=/^\w+@\w+\.\w+$/
const verificaciondivicion=/^\d+°\d+$/
const cantidad=6;

const registro = async(e) =>{
e.preventDefault()
if(nombre.length>=cantidad&&contraseña.length>=cantidad){
if(letras.test(nombre)&&letras.test(contraseña)&&verificarmail.test(mail)&&verificaciondivicion.test(año_division)){
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
else{
alert("error: caracteres no permitidos")
console.log(verificarmail.test(mail))
}
}
else{
alert("error: tiene que haber un minimo de 6 carateres")
}
}


return (
<>

<form onSubmit={registro} className = "register-form">
<input type= "name" placeholder ="Nombre" onChange={(e) => setNombre(e.target.value)}>
</input>
<input type= "appelido" placeholder ="Apellido" onChange={(e) => setApellido(e.target.value)}>
</input>
<input type= "email" placeholder ="Email" onChange={(e) => setMail(e.target.value)}>
</input>
<input type= "año_division" placeholder ="Año y Division" onChange={(e) => setAño_Division(e.target.value)}>
</input>
<input type= "password"  placeholder ="Contraseña" onChange={(e) => setContraseña(e.target.value)}>
</input>

<button type="submit" className="ingresar-button">
              Ingresar
            </button>
            </form>
</>
);



}