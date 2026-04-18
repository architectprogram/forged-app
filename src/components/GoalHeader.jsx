export default function GoalHeader({ goal, dayNumber, compact = false }) {
  if (!goal) return null

  if (compact) {
    return (
      <div className="goal-header--compact">
        <div className="goal-header__day">Day {dayNumber} of 21</div>
        <div className="goal-header__text">{goal.goal_text}</div>
      </div>
    )
  }

  return (
    <div className="goal-header">
      <div className="goal-header__day">Day {dayNumber} of 21</div>
      <div className="goal-header__text">{goal.goal_text}</div>
      <div className="goal-header__identity">{goal.identity}</div>
    </div>
  )
}
