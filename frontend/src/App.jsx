import { useState } from 'react'
import './App.css'
import Chatbot from './components/ChatBot'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Header from './components/Header'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <div className="bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center py-6 text-gray-800">
        Uplyft Electronics Chatbot
      </h1>
      <Router>
        <Header />
        <main className="container mx-auto px-4 pb-8">
          <Routes>
            <Route path='/' element={<Chatbot />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
          </Routes>
        </main>
      </Router>
    </div>
    </>
  )
}

export default App
