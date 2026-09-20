import {  Routes, Route } from 'react-router-dom'
import { useState } from 'react'

import Home from './pages/Home.jsx'
import Login from './pages/login.jsx'
import Register from './pages/registro.jsx'
import './App.css'

function App() {
 

  return (
    <>
      
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/login' element ={<Login/>}></Route>
          <Route path='/register' element ={<Register/>}></Route>
        </Routes>
      
    </>
  )
}

export default App
