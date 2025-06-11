import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const [username,setUsername] = useState("")
    const [password, setPassword] = useState("");
    const [confirmpassword,setConfirmPass] = useState("")
    const navigate = useNavigate();

    const handleSignup = async() => {
        try{
            await axios.post(`${import.meta.env.VITE_API_BASE}/chat/signup/`, {
        username,
        password,
        confirmpassword,
      });
      alert("Signup successful, now login.");
      navigate("/login");
    } catch (err) {
      alert("Signup failed");
      console.error(err);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16 p-8 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
      <input
        className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        placeholder="Confirm Password"
        type="password"
        value={confirmpassword}
        onChange={(e) => setConfirmPass(e.target.value)}
      />
      <button 
        onClick={handleSignup} 
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
      >
        Sign Up
      </button>
    </div>
  )
    }

export default SignUp;