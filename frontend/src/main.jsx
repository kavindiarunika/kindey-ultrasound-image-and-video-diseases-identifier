import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppProvider from "./kidneycontext/appContext.jsx";
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </AppProvider>
  </BrowserRouter>
)
