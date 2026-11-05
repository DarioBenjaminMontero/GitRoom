import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './crud.css';

const Crud = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    
    // Estado para el formulario de edición
    const [usuarioEditando, setUsuarioEditando] = useState(null);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [mail, setMail] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [admin, setAdmin] = useState(false);
    const [quitarFoto, setQuitarFoto] = useState(false);

    const token = localStorage.getItem('token'); // O de donde saques tu token de autenticación

    // 1. Obtener todos los usuarios al cargar la página
    const cargarUsuarios = async () => {
        try {
            const res = await axios.get('http://localhost:3000/crud/obtenerUsuarios', {
                headers: { Authorization: token }
            });
            setUsuarios(res.data);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    // 2. Buscar usuarios por mail en tiempo real
    useEffect(() => {
        const buscar = async () => {
            if (busqueda.trim() === "") {
                cargarUsuarios();
                return;
            }
            try {
                const res = await axios.post('http://localhost:3000/crud/buscarUsuarios', 
                    { mail: busqueda },
                    { headers: { Authorization: token } }
                );
                setUsuarios(res.data);
            } catch (error) {
                console.error("Error al buscar:", error);
            }
        };

        const timer = setTimeout(() => {
            buscar();
        }, 300); // Pequeño retraso para evitar llamadas excesivas

        return () => clearTimeout(timer);
    }, [busqueda]);

    // 3. Eliminar usuario
    const eliminarUsuario = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;

        try {
            await axios.delete(`http://localhost:3000/crud/eliminarUsuario/${id}`, {
                headers: { Authorization: token }
            });
            setUsuarios(usuarios.filter(u => u.id_usuario !== id));
            alert("Usuario eliminado con éxito");
        } catch (error) {
            alert(error.response?.data?.message || "Error al eliminar");
        }
    };

    // 4. Preparar datos para editar
    const abrirEdicion = (usuario) => {
        setUsuarioEditando(usuario.id_usuario);
        setNombre(usuario.nombre);
        setApellido(usuario.apellido || '');
        setMail(usuario.mail);
        setContraseña('');
        setAdmin(usuario.admin);
        setQuitarFoto(false);
    };

    // 5. Guardar cambios de edición
    const actualizarUsuario = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:3000/crud/actualizarUsuario/${usuarioEditando}`, {
                nombre,
                apellido,
                mail,
                contraseña,
                admin,
                quitar_foto: quitarFoto
            }, {
                headers: { Authorization: token }
            });

            alert(res.data.message);
            setUsuarioEditando(null);
            cargarUsuarios(); // Recargamos la lista
        } catch (error) {
            console.error("Error al actualizar:", error);
            alert("No se pudo actualizar el usuario");
        }
    };

    return (
        <div className="crud-container">
            <h2>Panel de Administración - GitRoom</h2>

            {/* Barra de búsqueda */}
            <input 
                type="text" 
                placeholder="Buscar por correo..." 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="crud-search"
            />

            {/* Tabla de usuarios */}
            <table className="crud-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Mail</th>
                        <th>Admin</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((u) => (
                        <tr key={u.id_usuario}>
                            <td>{u.nombre}</td>
                            <td>{u.apellido}</td>
                            <td>{u.mail}</td>
                            <td>{u.admin ==true ? 'Sí' : 'No'}</td>
                            <td>
                                <button onClick={() => abrirEdicion(u)} className="btn-editar">Editar</button>
                                <button onClick={() => eliminarUsuario(u.id_usuario)} className="btn-eliminar">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Formulario / Modal simple de Edición */}
            {usuarioEditando && (
                <div className="crud-modal">
                    <form onSubmit={actualizarUsuario} className="crud-form">
                        <h3>Editar Usuario</h3>
                        
                        <label>Nombre:</label>
                        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

                        <label>Apellido:</label>
                        <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} />

                        <label>Mail:</label>
                        <input type="email" value={mail} onChange={(e) => setMail(e.target.value)} required />

                        <label>Nueva Contraseña (opcional):</label>
                        <input type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} placeholder="Dejar en blanco para no cambiar" />

                        <label className="checkbox-label">
                            <input type="checkbox" checked={admin} onChange={(e) => setAdmin(e.target.checked)} />
                            Es Administrador
                        </label>

                        <label className="checkbox-label">
                            <input type="checkbox" checked={quitarFoto} onChange={(e) => setQuitarFoto(e.target.checked)} />
                            Quitar foto de perfil
                        </label>

                        <div className="form-buttons">
                            <button type="submit" className="btn-guardar">Guardar</button>
                            <button type="button" onClick={() => setUsuarioEditando(null)} className="btn-cancelar">Cancelar</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Crud;