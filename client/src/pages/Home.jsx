import { useState } from "react";
import axios from "axios";
import ObtenerClases from './ObtenerClases.jsx'



import GitRoomLogo from '../assets/GitRoom_Logo.png'

export default function Home() {
 const token = localStorage.getItem("token")
if (token){
   return (
    <>
      <section id="center">
        <div className="hero">
          <img src={GitRoomLogo} className="base" width="170" height="179" alt="" />
        </div>
        <div>
          <h1>Bienvenido a GitRoom</h1>
          <p>
            aca deberia aparecer todo el resto pije xd
            pero almenos iniciaste sesion pije es lo que importa 
          </p>
          <h2>aca deberiamos tener una peticion para cargar las clases y los repositorios, o un boton que las deslice y que eso lo cargue XD </h2>

          <ObtenerClases/>
        </div>
        
      </section>

      <div className="ticks"></div>


      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}
else{
  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={GitRoomLogo} className="base" width="170" height="179" alt="" />
        </div>
        <div>
          <h1>Bienvenido a GitRoom</h1>
          <h1>Your best friend for <u><b>learning</b></u></h1>
          <p>
            View your classes, create repositories, connect with other programmers, all here on Gitroom
          </p>
          <p>
            Inicie sesion o cree cuenta para continuar
          </p>
        </div>
        
      </section>

      <div className="ticks"></div>


      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )

}
}
