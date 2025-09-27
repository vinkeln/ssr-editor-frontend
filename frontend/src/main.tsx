import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/index.css'
import App from './App.tsx'

// Basename is setting all routes under /ssr-editor-frontend
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/ssr-editor-frontend">
      <App />
    </BrowserRouter>
  </StrictMode>,
)
