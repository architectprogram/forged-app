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
      <svg className="auth-logo" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="256,72 452,432 60,432" fill="none" stroke="#C9A84C" strokeWidth="32" strokeLinejoin="round" />
        <line x1="152" y1="312" x2="360" y2="312" stroke="#C9A84C" strokeWidth="32" strokeLinecap="round" />
      </svg>

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
