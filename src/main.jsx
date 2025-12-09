// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RegisterProvider } from './context/RegisterContext'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RegisterProvider>
      <App />
    </RegisterProvider>
  </React.StrictMode>,
)