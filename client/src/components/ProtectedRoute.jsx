import React from 'react'
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';


const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    console.log("Protected Route - user:", user); //Debugging

    // If there is no user, redirect to login page
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Otherwise, render the children (the protected component)
    return children;
};

export default ProtectedRoute;