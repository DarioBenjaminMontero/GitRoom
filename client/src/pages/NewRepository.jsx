import { useEffect, useState} from "react";
import axios from  'axios'
import { useNavigate, Link } from "react-router-dom";
import '../NewRepository.css'
export default function NewRepository(){

const [visibilidad, setVisibilidad] = useState('public');
const [nombreRepo, setNombreRepo] = useState('')
const [descripcionRepo, setDescripcionRepo] = useState('')
const [disponibilidad, setDisponibilidad] = useState('')
const token = localStorage.getItem('token');
useEffect(()=>{
setDisponibilidad('validando') 
if (!nombreRepo.trim()) {
            setDisponibilidad(null);
            return; 
        }
const esperar = setTimeout(async() => {
   
try{
    const respuesta = await axios.get(`http://localhost:3000/repositorios/nombreRepositorioExiste?nombre=${nombreRepo}`, {

headers: {

Authorization :  `Bearer ${token}` 

}

    })

    if(respuesta.data.exists){
        setDisponibilidad("ocupado")
    }else{
        setDisponibilidad("disponible")
    }
}
catch(err){
    console.log(err)
    setDisponibilidad(null)
}
}, 500)
return () =>clearTimeout(esperar)

}, [nombreRepo, token])



const crearRepositorio = async()=>{

if(disponibilidad === 'ocupado'){
   console.log("No se puede, está ocupado")
   return
}
else if(disponibilidad === 'disponible'){
console.log("disponible, siguiendo con el proceso")
}
try{
const nuevoRepositorio = {
nombre : nombreRepo,
descripcion : descripcionRepo,
visibilidad : visibilidad
}
const respuesta = await axios.post("http://localhost:3000/repositorios/crearRepositorio", nuevoRepositorio, {
headers: {
   Authorization : `Bearer ${token}` 
}
})
console.log("Repositorio creado con éxito:", respuesta.data);
}
catch(error){
   console.error("Error al crear el repositorio:", error);
}
}
return(
<>
<input placeholder="¿Que nombre tendrá este increible proyecto?" value = { nombreRepo } 
onChange={(e) => {setNombreRepo(e.target.value)}}></input>
<input placeholder="¿Como describirias lo que estás por crear?" onChange={(e) => {setDescripcionRepo(e.target.value)}}></input>
<label>
<input type="radio"
 name="visibilidad" 
 value = "public"
 checked = {visibilidad === "public"}
 onChange={(e) => setVisibilidad(e.target.value)}></input>
Repositorio Publico
<h6>Podrá verlo el mundo</h6>
</label>
<label>
<input type="radio"
 name="visibilidad" 
 value = "private"
 checked = {visibilidad === "private"}
 onChange={(e) => setVisibilidad(e.target.value)}></input>
Repositorio Privado
<h6>Solo tu y tus compañeros que invites lo verán</h6>
</label>
<button onClick={crearRepositorio}> ¡Crear! </button>
   </>
)
}