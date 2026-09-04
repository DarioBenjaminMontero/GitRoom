import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'

import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import './App.css'

function App() {
 

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/Login' element ={<Login/>}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
