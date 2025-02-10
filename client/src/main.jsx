import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext.jsx"
import { FriendsProvider } from "./context/FriendsContext.jsx"

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <FriendsProvider>
        <App />
      </FriendsProvider>
    </AuthProvider>
  </BrowserRouter>
)
