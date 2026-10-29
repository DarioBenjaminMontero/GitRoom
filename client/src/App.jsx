import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import BuscarUsuarios from './pages/buscarUsuarios.jsx'
import Header from './components/header.jsx' // 👈 Asegúrate de importar tu Header
import Home from './pages/Home.jsx'
import Login from './pages/login.jsx'
import Register from './pages/registro.jsx'
import Repositorios from './pages/repositorios.jsx'
import RepositorioCarpetas from './pages/repositorioCarpetas.jsx'
import Repositorio from './pages/Repositorio.jsx'
import NewRepository from './pages/NewRepository.jsx'
import Perfil from './pages/Perfil.jsx'
import Chat from './pages/chats.jsx'
import './pages/chats.css'
import './App.css'

function App() {
  const [actualizarClases, setActualizarClases] = useState(0);

  const dispararActualizacion = () => {
    setActualizarClases(prev => prev + 1); 
  };

  return (
    <>
      {/* 🚀 Renderizamos el Header globalmente y le pasamos el disparador */}
      <Header onClaseCreada={dispararActualizacion} />

      <Routes>
        <Route path='/' element={<Home refreshTrigger={actualizarClases} />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/repositorios' element={<Repositorios />} />
        <Route path='/repositorios/subir/:id' element={<RepositorioCarpetas/>}></Route>
        <Route path='/repositorios/:idRepo' element={<Repositorio/>}></Route>
        <Route path='/newRepository' element={<NewRepository />} />
        <Route path='/perfil' element={<Perfil />} />
        <Route path="/perfil/:id" element={<Perfil />} />
        <Route path='/chats' element={<Chat />} />
        <Route path="/buscar-usuarios" element={<BuscarUsuarios />} />
      </Routes>
    </>
  )
}

export default App