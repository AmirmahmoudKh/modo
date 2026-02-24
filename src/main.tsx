import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// ─── تم را زودتر از همه لود کن ───
import './store/useThemeStore'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)