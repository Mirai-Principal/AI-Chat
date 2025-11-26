import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ChatInterface from './ChatInterface.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChatInterface />
  </StrictMode>,
)
