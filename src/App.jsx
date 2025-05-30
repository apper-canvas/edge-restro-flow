import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-surface-50 via-blue-50 to-amber-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900 transition-colors duration-300">
          <Routes>
            <Route path="/" element={<Home darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={darkMode ? 'dark' : 'light'}
            className="toast-container"
            toastClassName="toast-custom"
          />
        </div>
      </Router>
    </div>
  )
}

export default App