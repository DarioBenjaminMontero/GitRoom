import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';


const socket = io("http://localhost:3000");

export default function ChatsPage() {
  const [chats, setChats] = useState([]);
  const [chatActivo, setChatActivo] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  
  const user = JSON.parse(localStorage.getItem('user'));
  const idActual=user.id
 
  const token = localStorage.getItem('token');

  // Cargar la lista de chats al entrar a la página
  useEffect(() => {

    // Escuchar mensajes nuevos en tiempo real vía Socket.io
    
    const obtenerChats = async () => {
      try {
        const response = await axios.get('http://localhost:3000/chats/cargarChats', {
          headers: { Authorization: token }
        });
        setChats(response.data);
        
      } catch (error) {
        console.error("Error al cargar los chats:", error);
      }
      
    };
    
    obtenerChats();
  }, [token]);
  useEffect(() => {
    socket.on('recibir_mensaje', (mensajeNuevo) => {
      // Añadimos el mensaje nuevo respetando los mensajes que ya estaban en pantalla
      setMensajes((prevMensajes) => [...prevMensajes, mensajeNuevo]);
    });

    // Limpieza: cuando salimos de la página o cambia el componente, apagamos el socket para que no se duplique
    return () => {
      socket.off('recibir_mensaje');
    };
  }, []);
  const obtenerMensajes = async (chat)=>{
     try {
      const idChat = chat.id_chat 
        const response = await axios.post('http://localhost:3000/chats/cargarMensajes',{
          id_chat: idChat
        }, {
          headers: { Authorization: token }
        });
        setMensajes(response.data);
        console.log(mensajes)
        
      } catch (error) {
        console.error("Error al cargar los chats:", error);
      }
  }

  // Manejar la selección de un chat y unirse a la sala de Socket.io
  const seleccionarChat = (chat) => {
    setChatActivo(chat);
    socket.emit('unirse_a_chat', chat.id_chat);
    
   obtenerMensajes(chat)
  };

  // Enviar mensaje usando tu endpoint POST
  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim() || !chatActivo) return;

    try {
      await axios.post('http://localhost:3000/chats/mensaje', {
        id_chat: chatActivo.id_chat,
        mensaje: nuevoMensaje
      }, {
        headers: { Authorization: token }
      });

      setNuevoMensaje('');
      obtenerMensajes(chatActivo)
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  return (
    <div className="chats-container">
      {/* Columna Izquierda: Lista de Chats */}
      <div className="chats-sidebar">
        <h2>Tus Chats</h2>
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div 
              key={chat.id_chat}
              onClick={() => seleccionarChat(chat)}
              className={`chat-item ${chatActivo?.id_chat === chat.id_chat ? 'activo' : ''}`}
            >
              <strong>Chat #{chat.id_chat}</strong>
              <p className="chat-participants">
                {chat.usuarios?.map(u => u.nombre).join(', ')}
              </p>
            </div>
          ))
        ) : (
          <p className="no-chats">No tienes chats disponibles.</p>
        )}
      </div>

      {/* Columna Derecha: Ventana del Chat Activo */}
      <div className="chat-window">
        {chatActivo ? (
          <>
            <div className="chat-header">
              <h3>Chat con: {chatActivo.usuarios?.map(u => u.nombre).join(', ')}</h3>
            </div>
            
            <div className="mensajes-container">
              <p className="placeholder-mensaje">Aquí aparecerán los mensajes del chat #{chatActivo.id_chat}</p>
             
              {mensajes.map((m, index) => {
                const esMio = m.id_emisor ===idActual
                return(
                  <div key={index} className={`mensaje-item ${esMio ? 'propio' : 'ajeno'}`}>
                    <p>{m.mensaje}</p>
                  </div>
                )})}
              
            
            </div>

            <form onSubmit={enviarMensaje} className="chat-form">
              <input 
                type="text"
                placeholder="Escribe un mensaje..."
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                className="chat-input"
              />
              <button type="submit" className="btn-enviar">
                Enviar
              </button>
            </form>
          </>
        ) : (
          <div className="chat-vacio">
            Selecciona un chat de la izquierda para comenzar a hablar.
          </div>
        )}
      </div>
    </div>
  );
}