import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const backendPort = import.meta.env.VITE_BACKEND_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("attempting logging in with: ", email, password);
      console.log(backendPort);
      const response = await axios.post(`${backendPort}/api/auth/login`, { email, password }, { withCredentials: true });
      console.log("response received:", response.data.user);
      login(response.data.user);
      navigate("/chat");
    } catch (error) {
      console.error("Login Error:", error);

      if (error.response) {
        console.log("Response Data:", error.response.data);
        console.log("Response Status:", error.response.status);
        console.log("Response Headers:", error.response.headers);
      } else if (error.request) {
        console.log("Request was made but no response received:", error.request);
      } else {
        console.log("Error setting up request:", error.message);
      }
    }
  };


  return (
    <div>
      <h1>Login</h1>
      <form action="" onSubmit={handleLogin}>
        <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" name="" id="" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type='submit'>Login</button>
      </form>
      <p>
        Don't have and account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  )
}

export default Login