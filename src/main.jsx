import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MasjidManager from '../imarah.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MasjidManager />
  </StrictMode>,
)
