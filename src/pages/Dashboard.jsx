import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useGoal } from '../hooks/useGoal'
import { useCompletions } from '../hooks/useCompletions'
import { getDayNumber, getCompoundMultiplier } from '../lib/utils'
import ArchitectLogo from '../components/ArchitectLogo'
import GoalHeader from '../components/GoalHeader'
import DailyButton from '../components/DailyButton'
import CompoundVisualizer from '../components/CompoundVisualizer'

// ui states
const UI = { LOADING: 'loading', BUTTON: 'button', EXITING: 'exiting', VISUALIZER: 'visualizer', GATE: 'gate' }

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { goal, loading: goalLoading, completeGoal } = useGoal(user?.id)
  const { completions, loading: compLoading, logCompletion } = useCompletions(goal?.id, user?.id)

  const [uiState, setUiState] = useState(UI.LOADING)
  const [logging, setLogging] = useState(false)

  // Redirect to onboarding if no active goal
  useEffect(() => {
    if (!goalLoading && goal === null) {
      navigate('/onboarding', { replace: true })
    }
  }, [goalLoading, goal, navigate])

  // Set initial UI state once data loads
  useEffect(() => {
    if (goalLoading || compLoading || !goal) return

    const dayNumber = getDayNumber(goal.started_at)
    const todayLogged = completions.some(c => c.day_number === dayNumber)
    const is21Done = dayNumber === 21 && completions.length === 21

    if (is21Done) {
      setUiState(UI.GATE)
    } else if (todayLogged) {
      setUiState(UI.VISUALIZER)
    } else {
      setUiState(UI.BUTTON)
    }
  }, [goalLoading, compLoading, goal, completions])

  async function handleLog(completed) {
    if (logging) return
    setLogging(true)

    // Start exit animation
    setUiState(UI.EXITING)

    const dayNumber = getDayNumber(goal.started_at)
    await logCompletion(dayNumber, completed)

    // Let exit animation finish, then show visualizer
    setTimeout(() => {
      setUiState(UI.VISUALIZER)
      setLogging(false)
    }, 420)
  }

  async function handleNewGoal() {
    await completeGoal()
    navigate('/onboarding')
  }

  if (uiState === UI.LOADING) {
    return (
      <div className="splash">
        <div className="splash__dot" />
      </div>
    )
  }

  const dayNumber = goal ? getDayNumber(goal.started_at) : 1
  const winCount = completions.filter(c => c.completed).length

  // ── Day 21 gate for free users ──────────────────────────
  if (uiState === UI.GATE) {
    const isPremium = false // TODO: wire to profiles.is_premium
    if (!isPremium) {
      return (
        <div className="screen screen--centered gate-screen">
          <ArchitectLogo className="dashboard-logo" style={{ position: 'absolute', top: 'calc(var(--safe-top) + 20px)', left: 20 }} />
          <button className="signout-btn" onClick={() => supabase.auth.signOut()} aria-label="Sign out">Sign out</button>
          <div className="gate-wins">{winCount}</div>
          <div className="gate-wins-label">wins in 21 days</div>
          <h2 className="gate-heading">You built a habit.</h2>
          <p className="gate-body">
            You just proved the method. 1% better, compounded — that's{' '}
            <strong style={{ color: 'var(--gold)' }}>{getCompoundMultiplier(winCount)}x</strong> the man you were 21 days ago.
            <br /><br />
            Architect builds the lifestyle.
          </p>
          <a
            href="https://thearchitectprograms.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            Continue with Architect
          </a>
        </div>
      )
    }
    // Premium: go straight to new goal selection
    handleNewGoal()
    return null
  }

  // ── Main dashboard ───────────────────────────────────────
  return (
    <div className="screen dashboard">
      <ArchitectLogo className="dashboard-logo" />
      <button className="signout-btn" onClick={() => supabase.auth.signOut()} aria-label="Sign out">
        Sign out
      </button>

      {/* BUTTON VIEW — not yet logged today */}
      {(uiState === UI.BUTTON || uiState === UI.EXITING) && (
        <div className={`button-view ${uiState === UI.EXITING ? 'exiting' : ''}`}>
          <GoalHeader goal={goal} dayNumber={dayNumber} />
          <DailyButton onLog={handleLog} disabled={logging} />
        </div>
      )}

      {/* VISUALIZER VIEW — logged today */}
      {uiState === UI.VISUALIZER && (
        <div className="visualizer-view">
          <GoalHeader goal={goal} dayNumber={dayNumber} compact />
          <CompoundVisualizer completions={completions} currentDay={dayNumber} />
        </div>
      )}
    </div>
  )
}
