// Returns which day of the 21-day cycle it is (1–21), based on goal start date
export function getDayNumber(startedAt) {
  const start = new Date(startedAt)
  start.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24))
  return Math.max(1, Math.min(diff + 1, 21))
}

// Returns current consecutive streak info from completion log
export function getStreakInfo(completions) {
  const completedDays = completions
    .filter(c => c.completed)
    .map(c => c.day_number)
    .sort((a, b) => a - b)

  if (completedDays.length === 0) {
    return { streakDays: new Set(), streakLength: 0 }
  }

  const lastDay = completedDays[completedDays.length - 1]
  const streakDays = new Set()

  for (let d = lastDay; d >= 1; d--) {
    if (completedDays.includes(d)) streakDays.add(d)
    else break
  }

  return { streakDays, streakLength: streakDays.size }
}

// 1% compounded over n wins: 1.01^n formatted as "1.23x"
export function getCompoundMultiplier(winCount) {
  return Math.pow(1.01, winCount).toFixed(2)
}
