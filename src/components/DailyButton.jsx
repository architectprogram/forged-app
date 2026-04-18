export default function DailyButton({ onLog, disabled }) {
  return (
    <div className="daily-btn-wrap">
      <button
        className="daily-btn"
        onClick={() => onLog(true)}
        disabled={disabled}
        aria-label="I showed up today"
      >
        I showed up
      </button>
      <button
        className="daily-miss"
        onClick={() => onLog(false)}
        disabled={disabled}
        aria-label="I missed today"
      >
        I missed today
      </button>
    </div>
  )
}
