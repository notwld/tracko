import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import ProductBacklogs from './pages/ProductBacklogs.jsx'
import Home from './pages/Home.jsx'
import Board from './pages/Board.jsx'
import PokerPlaning from './pages/PokerPlaning.jsx'
import Profile from './pages/Profile.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Project from './pages/Project.jsx'
import Cocomo from './components/Cocomo.jsx'
import Eaf from './components/EAF.jsx'
import Effort from './components/Effort.jsx'
import Conversion from './components/Conversion.jsx'


const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children:[
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/home",
        element: <Home />
      },
      {
        path: "/project/:id",
        element: <Project />
      },
      {
        path: "/project/:id/backlogs",
        element: <ProductBacklogs />
      },
      {
        path: "/project/:id/board",
        element: <Board />
      },
      {
        path: "/project/:id/poker-planning",
        element: <PokerPlaning />
      },
      {
        path: "/profile",
        element: <Profile />
      },
      {
        path: "/Cocomo",
        element: <Cocomo/>
      },
      {
        path: "/Eaf",
        element: <Eaf />
      },
      {
        path: "/Effort",
        element: <Effort />
      },
      {
        path: "/Conversion",
        element: <Conversion/>
      }
    ]
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={routes} />
  </React.StrictMode>
)
