import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Craeating Auth Context
const AuthContext = createContext();


// Auth Provider Component
export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null); // Store user data
    const [loading, setLoading] = useState(true);
    const backendPort = import.meta.env.VITE_BACKEND_URL;

    // Fetch user on page refresh
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await axios.get(`${backendPort}/api/auth/me`, { withCredentials: true });
                setUser(data); // Update state with user data
            } catch (error) {
                console.log("Not logged in");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await axios.post(`${backendPort}/api/auth/logout`, {}, { withCredentials: true });
            setUser(null);
        } catch (error) {
            console.log("Logout failed");
        }
    };

    if (loading) return <div>Loading...</div> // Prevents flashing of UI

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);