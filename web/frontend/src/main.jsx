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
import BasicCocomo from './pages/Traditional/BasicCocomo.jsx'
import IntermediateCocomo from './pages/Traditional/IntermediateCocomo.jsx'
import UseCase from './pages/Traditional/UseCase.jsx'
import SimpleFP from './pages/Traditional/SimpleFP.jsx'
import HR from './pages/HR.jsx'
import UseCaseDoc from './pages/UseCaseDoc.jsx'
import Calculations from './pages/Traditional/Calculations.jsx'
import Traditional from './pages/Traditional.jsx'
import Landing from './pages/Landing.jsx'


const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children:[
      {
        path: "/welcome",
        element: <Landing />
      },
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
        path: "/project/:id/cocomo",
        element: <Cocomo/>
      },
      {
        path: "project/:id/eaf",
        element: <Eaf />
      },
      {
        path: "/project/:id/effort",
        element: <Effort />
      },
      {
        path: "/project/:id/conversion",
        element: <Conversion/>
      },
      {
        path: "/project/:id/BasicCocomo",
        element: <BasicCocomo/>
      },
      {
        path: "/project/:id/IntermediateCocomo",
        element: <IntermediateCocomo/>
      },
      {
        path: "/project/:id/UseCase",
        element: <UseCase/>
      },
      {
        path: "/project/:id/SimpleFP",
        element: <SimpleFP/>
      },
      {
        path: "/UseCaseDoc",
        element: <UseCaseDoc/>
      },
      {
        path: "/Calculations",
        element: <Calculations/>
      },
      {
        path:"/hr",
        element: <HR/>
      },
      {
        path:"/project/:id/traditional",
        element: <Traditional/>
      }

    ]
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={routes} />
  </React.StrictMode>
)
