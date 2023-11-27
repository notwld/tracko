import { Outlet } from 'react-router-dom'
import Nav from './components/Nav'
import Sidebar from './components/Sidebar'


function App() {

  return (
    <div>
      <Nav />
      <div className="container-fluid d-flex flex-row justify-content-center align-items-center">
      <Sidebar />
      <Outlet />
      </div>
    </div>
  )
}

export default App
