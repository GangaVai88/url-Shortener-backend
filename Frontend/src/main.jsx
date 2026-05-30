//Entry point of my entire frontend application. Takes the root react component and injects it to the html page so that it can be rendered in the screen
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
// <App /> is the main wrapper component.