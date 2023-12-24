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

const routes = createBrowserRouter([
  {
    path: "/",
    errorElement: <div className='container vw-100 vh-100'>Error</div>,
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
      }
    ]
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={routes} />
  </React.StrictMode>
)
