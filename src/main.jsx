import { createRoot } from 'react-dom/client'
import App from './App'
import { ContentProvider } from './content/ContentContext'
import './styles.css'

createRoot(document.getElementById('root')).render(<ContentProvider><App /></ContentProvider>)
