import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BuscarUsuarios() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const [resultados, setResultados] = useState([]);
  const [buscado, setBuscado] = useState(false);

  const buscar = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    const res = await fetch(`http://localhost:3000/users/buscar?q=${encodeURIComponent(q)}`, {
      headers: { authorization: token },
    });
    const data = await res.json();

    setResultados(Array.isArray(data) ? data : []);
    setBuscado(true);
  };

  return (
    <div>
      <h1>Buscar usuarios</h1>

      <form onSubmit={buscar}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre, apellido o mail"
        />
        <button type="submit">Buscar</button>
      </form>

      {buscado && resultados.length === 0 && <p>No se encontraron usuarios.</p>}

      <ul>
        {resultados.map((u) => (
          <li key={u.id_usuario}>
            <button onClick={() => navigate(`/perfil/${u.id_usuario}`)}>
              {u.nombre} {u.apellido} - {u.mail} ({u.año_division})
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}