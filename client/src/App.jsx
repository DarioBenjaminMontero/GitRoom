import {  Routes, Route } from 'react-router-dom'
import { useState } from 'react'

import Home from './pages/Home.jsx'
import Login from './pages/login.jsx'
import Register from './pages/registro.jsx'
import Repositorios from './pages/repositorios.jsx'
import NewRepository from './pages/NewRepository.jsx'
import Perfil from './pages/Perfil.jsx'
import Chat from './pages/chats.jsx'
import './pages/chats.css'
import './App.css'

function App() {
 

  return (
    <>
      
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/login' element ={<Login/>}></Route>
          <Route path='/register' element ={<Register/>}></Route>
          <Route path='/repositorios' element ={<Repositorios/>}></Route>
          <Route path='/newRepository' element ={<NewRepository/>}></Route>
          <Route path='/perfil' element ={<Perfil/>}></Route>
          <Route path='/chats' element ={<Chat/>}></Route>
        </Routes>
      
    </>
  )
}

export default App
