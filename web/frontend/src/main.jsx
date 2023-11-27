import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import {createBrowserRouter,RouterProvider} from 'react-router-dom'

const routes = createBrowserRouter([
  {
    path: "/",
    errorElement: <div className='container vw-100 vh-100'>Error</div>,
    element: <App />,
    children:[
      {
        path: "/",
        element: <div className='container '>Home</div>,
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={routes} />
  </React.StrictMode>
)
