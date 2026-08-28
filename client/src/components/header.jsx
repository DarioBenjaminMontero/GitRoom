import GitRoomLogo from '../assets/GitRoom_Logo.png'

export default function Header(){
return(
  
<section id="header">
    
      <img src={GitRoomLogo} width="140" height="100" alt="" /> 
      
      <div className='header-buttons'>
      <button id ="sesion">
        Iniciar Sesion
        
      </button>
      <button id ="registrar">
        Registrarse
      </button>
      </div>
    </section>
    
)}
    