import React from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div>
      <h1>Login</h1>
      <form action="">
        <input type="email" placeholder='Email' required />
        <input type="password" name="" id="" placeholder='Password' required />
        <button type='submit'>Login</button>
      </form>
      <p>
        Don't have and account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  )
}

export default Login