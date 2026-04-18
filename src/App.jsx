import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Intro from './pages/Intro'
import Auth from './pages/Auth'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'

function Splash() {
  return (
    <div className="splash">
      <div className="splash__dot" />
    </div>
  )
}

function DefaultRedirect() {
  const hasSeenIntro = localStorage.getItem('architect_intro_seen')
  const { user } = useAuth()

  if (!hasSeenIntro) return <Navigate to="/intro" replace />
  if (!user) return <Navigate to="/auth" replace />
  return <Navigate to="/dashboard" replace />
}

export default function App() {
  const { user } = useAuth()

  // Still resolving session
  if (user === undefined) return <Splash />

  return (
    <Routes>
      <Route path="/intro" element={<Intro />} />

      <Route
        path="/auth"
        element={user ? <Navigate to="/dashboard" replace /> : <Auth />}
      />

      <Route
        path="/onboarding"
        element={user ? <Onboarding /> : <Navigate to="/auth" replace />}
      />

      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/auth" replace />}
      />

      <Route path="*" element={<DefaultRedirect />} />
    </Routes>
  )
}
