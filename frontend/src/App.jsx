import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './utils/supabase'
import LoginPage from './components/LoginPage'
import NetworkActivityPage from './components/NetworkActivityPage'
import UpdatePasswordPage from './components/UpdatePasswordPage'
import './index.css'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-blue-500 text-xl animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={!session ? <LoginPage /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/dashboard"
          element={session ? <NetworkActivityPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/update-password"
          element={<UpdatePasswordPage />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
