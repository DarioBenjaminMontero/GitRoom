import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../NewRepository.css';

export default function NewRepository() {
    const [visibilidad, setVisibilidad] = useState('public');
    const [nombreRepo, setNombreRepo] = useState('');
    const [descripcionRepo, setDescripcionRepo] = useState('');
    const [disponibilidad, setDisponibilidad] = useState('');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        setDisponibilidad('validando');
        if (!nombreRepo.trim()) {
            setDisponibilidad(null);
            return;
        }
        const esperar = setTimeout(async () => {
            try {
                const respuesta = await axios.get(`http://localhost:3000/repositorios/nombreRepositorioExiste?nombre=${nombreRepo}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (respuesta.data.exists) {
                    setDisponibilidad("ocupado");
                } else {
                    setDisponibilidad("disponible");
                }
            } catch (err) {
                console.log(err);
                setDisponibilidad(null);
            }
        }, 500);
        return () => clearTimeout(esperar);
    }, [nombreRepo, token]);

    const crearRepositorio = async () => {
        if (disponibilidad === 'ocupado') {
            console.log("No se puede, está ocupado");
            return;
        }
        try {
            const nuevoRepositorio = {
                nombre: nombreRepo,
                descripcion: descripcionRepo,
                visibilidad: visibilidad
            };
            const respuesta = await axios.post("http://localhost:3000/repositorios/crearRepositorio", nuevoRepositorio, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Repositorio creado con éxito:", respuesta.data);
            navigate("/repositorios");
        } catch (error) {
            console.error("Error al crear el repositorio:", error);
        }
    };

    return (
        <div className="new-repo-container">
            <h2>Crear un nuevo repositorio</h2>
            
            <input 
                type="text"
                placeholder="¿Qué nombre tendrá este increíble proyecto?" 
                value={nombreRepo} 
                onChange={(e) => setNombreRepo(e.target.value)}
            />
            {disponibilidad === 'validando' && nombreRepo.trim() && <span className="feedback-validando">Validando disponibilidad...</span>}
            {disponibilidad === 'disponible' && <span className="feedback-disponible">¡Nombre disponible!</span>}
            {disponibilidad === 'ocupado' && <span className="feedback-ocupado">Este nombre ya está en uso.</span>}

            <input 
                type="text"
                placeholder="¿Cómo describirías lo que estás por crear?" 
                value={descripcionRepo}
                onChange={(e) => setDescripcionRepo(e.target.value)}
            />

            <label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                        type="radio"
                        name="visibilidad" 
                        value="public"
                        checked={visibilidad === "public"}
                        onChange={(e) => setVisibilidad(e.target.value)}
                    />
                    <span>Repositorio Público</span>
                </div>
                <h6>Podrá verlo el mundo</h6>
            </label>

            <label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                        type="radio"
                        name="visibilidad" 
                        value="private"
                        checked={visibilidad === "private"}
                        onChange={(e) => setVisibilidad(e.target.value)}
                    />
                    <span>Repositorio Privado</span>
                </div>
                <h6>Solo tú y tus compañeros que invites lo verán</h6>
            </label>

            <button onClick={crearRepositorio}> ¡Crear! </button>
        </div>
    );
}

