import { useState } from 'react';
import axios from 'axios';
export function CrearGrupo({ token, onCreado }) {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [elegidos, setElegidos] = useState([]);
  const [nombre, setNombre] = useState('');

  // 🍪 Cada vez que cambia el input, busca los usuarios que coinciden por email
  const buscar = async (texto) => {
    setBusqueda(texto);
    if (!texto.trim()) return setResultados([]);
    try {
      const response = await axios.get('http://localhost:3000/chats/buscarUsuarios', {
        params: { mail: texto },
        headers: { Authorization: token }
      });
      setResultados(response.data);
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
    }
  };

  const elegir = (usuario) => {
    if (!elegidos.some(u => u.id_usuario === usuario.id_usuario)) {
      setElegidos([...elegidos, usuario]);
    }
    setBusqueda('');
    setResultados([]);
  };

  const crearGrupo = async () => {
    try {
      const response = await axios.post('http://localhost:3000/chats/crearGrupo', {
        nombre,
        ids_usuarios: elegidos.map(u => u.id_usuario)
      }, {
        headers: { Authorization: token }
      });
      setElegidos([]);
      setNombre('');
      onCreado(response.data);
    } catch (error) {
      console.error("Error al crear el grupo:", error);
      alert("No se pudo crear el grupo");
    }
  };

  return (
    <div className="grupo-crear">
      <h2>Nuevo Grupo</h2>
      <input
        placeholder="Nombre del grupo..."
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="chat-input"
      />
      <input
        placeholder="Buscar usuario por mail..."
        value={busqueda}
        onChange={(e) => buscar(e.target.value)}
        className="chat-input"
      />

      {/* 🍪 No mostramos a los que ya estan elegidos */}
      {resultados.filter(u => !elegidos.some(e => e.id_usuario === u.id_usuario)).map((u) => (
        <div key={u.id_usuario} onClick={() => elegir(u)} className="chat-item">
          {u.nombre} <span className="chat-participants">{u.mail}</span>
        </div>
      ))}

      {/* 🍪 Usuarios elegidos, tocando uno se saca */}
      {elegidos.map((u) => (
        <span
          key={u.id_usuario}
          onClick={() => setElegidos(elegidos.filter(e => e.id_usuario !== u.id_usuario))}
          className="grupo-elegido"
        >
          {u.nombre} ✕
        </span>
      ))}

      {/* 🍪 Hace falta un nombre y al menos 2 personas ademas de vos (un grupo es de mas de 2) */}
      <button onClick={crearGrupo} disabled={!nombre.trim() || elegidos.length < 2} className="btn-crear-grupo">
        Crear grupo
      </button>
    </div>
  );
}
