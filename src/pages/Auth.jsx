import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: authError } = mode === 'signup'
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    navigate('/dashboard')
  }

  return (
    <div className="screen screen--centered">
      <img className="auth-logo" src="/icons/Gold.png" alt="Architect Programs" />

      <h1 className="auth-heading">
        {mode === 'signin' ? 'Welcome back.' : 'Create your account.'}
      </h1>
      <p className="auth-subheading">
        {mode === 'signin' ? 'Your 21-day cycle is waiting.' : 'Your 1% starts today.'}
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          minLength={6}
        />

        <div className="auth-error">{error}</div>

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? '...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <div className="auth-toggle">
        {mode === 'signin' ? (
          <>No account? <button onClick={() => { setMode('signup'); setError('') }}>Sign up</button></>
        ) : (
          <>Have an account? <button onClick={() => { setMode('signin'); setError('') }}>Sign in</button></>
        )}
      </div>
    </div>
  )
}
