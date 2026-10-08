import { useNavigate } from 'react-router-dom'
import GitRoomLogo from '../assets/GitRoom_Logo.png'

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('sesion cerrada')
    navigate('/login');
    setRefresh("logout")
  };
  if (token) {
    console.log(token); 
    console.log(user)
    return (

      
    <section id="header">
      <img src={GitRoomLogo} width="140" height="100" alt="" onClick={() => navigate("/")} />

<h2>
  Bienvenido {user.username}
</h2>
<div className='header-buttons'>
          <button id="repositorios-boton" onClick={() => navigate("/repositorios")}>
            Repositorios
          </button>
          <button id="sesion" onClick={logout}>
            Cerrar Sesión
          </button>
          <button id="newRepo" onClick={() => navigate("newRepository")}>
            repo
          </button>
        </div>

    </section>
)
  }

  else {
    return (

      <section id="header">

        <img src={GitRoomLogo} width="140" height="100" alt="" onClick={() => navigate("/")} />


        <div className='header-buttons'>
          <button id="sesion" onClick={() => navigate("/login")}>
            Iniciar Sesion

          </button>
          <button id="registrar" onClick={() => navigate("register")}>
            Registrarse
          </button>
          
        </div>
      </section>

    )
  }

}
