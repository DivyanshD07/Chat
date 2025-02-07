import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext.jsx"

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
)
