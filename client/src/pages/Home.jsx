import { useState } from "react";
import axios from "axios";



import GitRoomLogo from '../assets/GitRoom_Logo.png'

export default function Home() {
 

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={GitRoomLogo} className="base" width="170" height="179" alt="" />
        </div>
        <div>
          <h1>Bienvenido a GitRoom</h1>
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
