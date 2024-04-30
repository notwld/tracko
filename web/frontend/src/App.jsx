import { Outlet } from 'react-router-dom'
import Nav from './components/Nav'
import Sidebar from './components/Sidebar'
import './index.css'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function App() {
  
  
  return (
    <div>
      <Nav />
      <div className="container-fluid d-flex flex-row justify-content-center">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  )
}

export default App
