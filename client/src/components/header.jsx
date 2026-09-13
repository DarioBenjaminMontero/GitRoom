import { useNavigate } from 'react-router-dom'
import GitRoomLogo from '../assets/GitRoom_Logo.png'

export default function Header(){
  const navigate = useNavigate();
return(
  
<section id="header">
    
      <img src={GitRoomLogo} width="140" height="100" alt="" onClick={()=>navigate("/")}/> 
      
      <div className='header-buttons'>
      <button id ="sesion" onClick={() => navigate("/login")}>
        Iniciar Sesion
        
      </button>
      <button id ="registrar" onClick={()=> navigate ("register")}>
        Registrarse 
      </button>
      </div>
    </section>
    
)}
    