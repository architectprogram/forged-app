import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useGoal } from '../hooks/useGoal'

const QUESTIONS = [
  {
    num: '01',
    question: 'Who are you becoming?',
    hint: 'Not what you want to achieve — who you are in constant pursuit of being.',
    placeholder: 'A man who...',
    field: 'identity'
  },
  {
    num: '02',
    question: 'What is the one goal that moves you there?',
    hint: 'One goal. Not a list. The single thing that, if done every day for 21 days, compounds toward that identity.',
    placeholder: 'Every day I will...',
    field: 'goalText'
  },
  {
    num: '03',
    question: 'Why does this matter right now?',
    hint: "This is for you alone. It won't be stored — it's the reason you come back on day 11 when it's hard.",
    placeholder: 'Because...',
    field: 'why'
  }
]

export default function Onboarding() {
  const { user } = useAuth()
  const { createGoal } = useGoal(user?.id)
  const navigate = useNavigate()

  const [step, setStep] = useState(0) // 0-2 = questions, 3 = lock screen
  const [exiting, setExiting] = useState(false)
  const [values, setValues] = useState({ identity: '', goalText: '', why: '' })
  const [loading, setLoading] = useState(false)

  const current = QUESTIONS[step]

  function advance() {
    if (!values[current.field]?.trim()) return
    setExiting(true)
    setTimeout(() => {
      setExiting(false)
      setStep(s => s + 1)
    }, 400)
  }

  async function beginGoal() {
    setLoading(true)
    const { error } = await createGoal(values.identity, values.goalText)
    setLoading(false)
    if (!error) navigate('/dashboard')
  }

  return (
    <div className="screen onboarding" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Question steps */}
      {QUESTIONS.map((q, i) => (
        <div
          key={q.num}
          className={`onboarding-step ${i === step && !exiting ? 'active' : ''} ${i === step && exiting ? 'exit' : ''}`}
        >
          <div className="onboarding-step-num">{q.num} / 03</div>
          <h2 className="onboarding-question">{q.question}</h2>
          <p className="onboarding-hint">{q.hint}</p>

          <textarea
            className="onboarding-textarea"
            placeholder={q.placeholder}
            value={values[q.field]}
            onChange={e => setValues(v => ({ ...v, [q.field]: e.target.value }))}
            rows={3}
            autoFocus={i === step}
          />

          <div style={{ marginTop: 40 }}>
            <button
              className="btn-primary"
              onClick={advance}
              disabled={!values[q.field]?.trim()}
              style={{ maxWidth: '100%' }}
            >
              Continue
            </button>
          </div>
        </div>
      ))}

      {/* Lock screen */}
      <div className={`lock-screen ${step === 3 ? 'active' : ''}`}>
        <div className="lock-label">Your goal is locked.</div>
        <div className="lock-goal">{values.goalText}</div>
        {values.why && (
          <div className="lock-why">"{values.why}"</div>
        )}
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 48, maxWidth: 260, textAlign: 'center', lineHeight: 1.6 }}>
          For the next 21 days, this is all that matters. Show up. The rest compounds.
        </p>
        <button className="btn-primary" onClick={beginGoal} disabled={loading}>
          {loading ? '...' : 'Begin Day 1'}
        </button>
      </div>
    </div>
  )
}
