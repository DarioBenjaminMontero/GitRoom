import GitRoomLogo from '../assets/GitRoom_Logo.png'; 
import GitHubLogo from '../assets/github.png'
import './footer.css'


export default function Footer() {
  return (
    <footer id="footer">
      <div className="footer-container">
        
        <div className="footer-brand">
          <img src={GitRoomLogo} width="99" height="89" alt="GitRoom Logo" />
          <p className="footer-text">
            &copy; {new Date().getFullYear()} GitRoom. Todos los derechos reservados.
          </p>
        </div>


        <div className="footer-about">
          <h3>Sobre nosotros</h3>
          <p>
            GitRoom es la plataforma diseñada para conectar desarrolladores, 
            compartir proyectos y potenciar el trabajo en equipo de manera colaborativa.
          </p>
        </div>

        <div className="footer-social">
          <h3>Síguenos a nosotros y a nuestro trabajo</h3>
          <div className="social-links">
           <a href="https://github.com/DarioBenjaminMontero/GitRoom" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <img src={GitHubLogo} width="20" height="20" alt="GitHub Logo" /> GitHub
            </a>
          </div>
        </div>

       

      </div>
    </footer>
  );
}