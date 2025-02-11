import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const backendPort = import.meta.env.VITE_BACKEND_URL;

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendPort}/api/auth/register`, { username, email, password }, { withCredentials: true });
      login(data.user); // Save user in AuthContext
      navigate("/chat");
    } catch (error) {
      console.error("Signup failed:", error.response?.data?.message || error.message);
    }
  }

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup}>
        <input type="text" placeholder='Username' required />
        <input type="email" placeholder='Email' required />
        <input type="password" placeholder='Password' required />
        <button type='submit'>Sign Up</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  )
}

export default Signup