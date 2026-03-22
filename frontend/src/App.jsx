import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './utils/supabase'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'
import UserSettings from './components/UserSettings'
import UpdatePasswordPage from './components/UpdatePasswordPage'
import BlockchainExplorer from './components/BlockchainExplorer'
import WalletClusteringAnalysis from './components/WalletClusteringAnalysis'
import DataReportingInterface from './components/DataReportingInterface'
import LabelManagement from './components/LabelManagement'
import TopHotspots from './components/TopHotspots'
import AdminControlPanel from './components/AdminControlPanel'
import TransactionFlowVisualization from './components/TransactionFlowVisualization'
import RiskMonitoringDashboard from './components/RiskMonitoringDashboard'
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
          element={session ? <Dashboard /> : <Navigate to="/" replace />}
        />
        <Route
          path="/settings"
          element={session ? <UserSettings /> : <Navigate to="/" replace />}
        />
        <Route
          path="/explorer"
          element={session ? <BlockchainExplorer /> : <Navigate to="/" replace />}
        />
        <Route
          path="/clusters"
          element={session ? <WalletClusteringAnalysis /> : <Navigate to="/" replace />}
        />
        <Route
          path="/reports"
          element={session ? <DataReportingInterface /> : <Navigate to="/" replace />}
        />
        <Route
          path="/labels"
          element={session ? <LabelManagement /> : <Navigate to="/" replace />}
        />
        <Route
          path="/hotspots"
          element={session ? <TopHotspots /> : <Navigate to="/" replace />}
        />
        <Route
          path="/admin"
          element={session ? <AdminControlPanel /> : <Navigate to="/" replace />}
        />
        <Route
          path="/transaction-flow"
          element={session ? <TransactionFlowVisualization /> : <Navigate to="/" replace />}
        />
        <Route
          path="/risk-monitor"
          element={session ? <RiskMonitoringDashboard /> : <Navigate to="/" replace />}
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
