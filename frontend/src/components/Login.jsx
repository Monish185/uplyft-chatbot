import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
     const [username,setUsername] = useState('')
     const [password,setPassword] = useState('')
     const navigate = useNavigate();

     const handleLogin = async() => {

        try{

            const res = await axios.post(`${import.meta.env.VITE_API_BASE}/chat/login/`,{
                username,
                password,
            });

            localStorage.setItem('token',res.data.access);
            localStorage.setItem('username',res.data.user);
            navigate('/')
        }catch(err){
            alert("Invalid credentials");
            console.error(err);       
        }
     }
    return ( 
    <>
    <div className='max-w-sm mx-auto mt-16 p-8 border rounded-lg shadow-lg bg-white'>
        <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>Login</h2>
        <input
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          onClick={handleLogin} 
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          Login
        </button>   
    </div>
    </> 
    );
}

export default Login;