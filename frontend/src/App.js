// App.js
"use client"
import { useState } from "react"
import AppContext from "./context/AppContext"
import "./App.css"
import LoginForm from "./components/Auth/LoginForm"
import Dashboard from "./components/Dashboard/Dashboard"

const App = () => {
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <AppContext.Provider value={{ user, handleLogout }}>
      <div className="app">
        {user ? <Dashboard user={user} onLogout={handleLogout} /> : <LoginForm onLogin={handleLogin} />}
      </div>
    </AppContext.Provider>
  )
}

export default App