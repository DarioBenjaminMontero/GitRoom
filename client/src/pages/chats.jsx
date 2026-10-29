import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { CrearGrupo } from './grupos.jsx';


const socket = io("http://localhost:3000");

export default function ChatsPage() {
  const [chats, setChats] = useState([]);
  const [chatActivo, setChatActivo] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [mailChat, setMailChat] = useState('');
  const [miembros, setMiembros] = useState([]);

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
  
  // 🍪 En los grupos traemos los integrantes para saber quien mando cada mensaje
  useEffect(() => {
    if (!chatActivo || chatActivo.es_privado) return;
    axios.post('http://localhost:3000/chats/cargarMiembros', {
      id_chat: chatActivo.id_chat
    }, {
      headers: { Authorization: token }
    })
      .then((response) => setMiembros(response.data))
      .catch((error) => console.error("Error al cargar los miembros:", error));
  }, [chatActivo, token]);
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
    console.log(chatActivo)
    socket.emit('unirse_a_chat', chat.id_chat);
    
   obtenerMensajes(chat)
  };

  // 🍪 Crear un chat privado con el usuario del mail ingresado
  const crearChat = async (e) => {
    e.preventDefault();
    if (!mailChat.trim()) return;

    try {
      const response = await axios.post('http://localhost:3000/chats/crear', {
        mail: mailChat
      }, {
        headers: { Authorization: token }
      });

      if (!chats.some(c => c.id_chat === response.data.id_chat)) {
        setChats([...chats, response.data]);
      }
      setMailChat('');
      seleccionarChat(response.data);
    } catch (error) {
      console.error("Error al crear el chat:", error);
      alert(error.response?.data?.message || "No se pudo crear el chat");
    }
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
        <form onSubmit={crearChat} className="chat-form">
          <input
            type="email"
            placeholder="Mail del usuario..."
            value={mailChat}
            onChange={(e) => setMailChat(e.target.value)}
            className="chat-input"
          />
          <button type="submit" className="btn-enviar">
            +
          </button>
        </form>
        {chats.length > 0 ? (
          chats.map((chat) => {
            // Si es chat privado, filtramos al otro usuario 
            const otroUsuario = chat.usuarios?.find(u => u.id_usuario !== idActual)
             

            return (
              <div 
                key={chat.id_chat}
                onClick={() => seleccionarChat(chat)}
                className={`chat-item ${chatActivo?.id_chat === chat.id_chat ? 'activo' : ''}`}
              >
                <strong>{chat.es_privado ? (otroUsuario ? otroUsuario.nombre : 'Chat Privado') : "(grupo) " + chat.nombre }</strong>
                
                <p className="chat-participants">
                  {chat.es_privado 
                    ? (otroUsuario ? otroUsuario.mail : '') 
                    : chat.usuarios?.map(u => u.nombre).join(', ')}
                </p>
              </div>
            );
          })
        ) : (
          <p className="no-chats">No tienes chats disponibles.</p>
        )}
        <CrearGrupo
          token={token}
          onCreado={(grupo) => {
            setChats([...chats, grupo]);
            seleccionarChat(grupo);
          }}
        />
      </div>

      {/* Columna Derecha: Ventana del Chat Activo */}
      <div className="chat-window">
        {chatActivo ? (
          <>
            <div className="chat-header">
              {/* 🍪 En los grupos se muestra el nombre del grupo en vez de "Chat con:" */}
              {chatActivo.es_privado
           
                ? <h3>Chat privado con: {chatActivo.usuarios?.filter(u =>u.id_usuario!==idActual).map(u => u.nombre).join(' , ')}</h3>
                : <h3>Chat grupal con: {chatActivo.usuarios?.filter(u =>u.id_usuario!==idActual).map(u => u.nombre).join(' , ')}</h3>}
            </div>
            
            <div className="mensajes-container">
              <p className="placeholder-mensaje">Aquí aparecerán los mensajes del chat #{chatActivo.id_chat}</p>
             
              {mensajes.map((m, index) => {
                const esMio = m.id_emisor ===idActual
                return(
                  <div key={index} className={`mensaje-item ${esMio ? 'propio' : 'ajeno'}`}>
                    {!chatActivo.es_privado && !esMio && (
                      <small className="mensaje-autor">
                        {miembros.find(u => u.id_usuario === m.id_emisor)?.nombre}
                      </small>
                    )}
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