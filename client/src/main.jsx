import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import Header from './components/header.jsx'
import App from './App.jsx'
import Footer from './components/footer.jsx'
  
createRoot(document.getElementById('root')).render(
  <StrictMode>  
    <Router>
    <Header/>
    <App />
    <Footer />
  </Router>
  </StrictMode>,
)
