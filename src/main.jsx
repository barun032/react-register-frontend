import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RegisterProvider } from './context/RegisterContext'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <RegisterProvider>
        <App />
      </RegisterProvider>
    </BrowserRouter>
  </React.StrictMode>,
)