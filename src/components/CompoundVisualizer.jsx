import { getStreakInfo, getCompoundMultiplier } from '../lib/utils'

const SVG_SIZE = 300
const CENTER = 150
const RADIUS = 115
const NODE_R = 9

export default function CompoundVisualizer({ completions }) {
  const { streakDays, streakLength } = getStreakInfo(completions)
  const sortedStreak = [...streakDays].sort((a, b) => a - b)
  const winCount = completions.filter(c => c.completed).length
  const multiplier = getCompoundMultiplier(winCount)

  const nodes = Array.from({ length: 21 }, (_, i) => {
    const day = i + 1
    const angle = (i / 21) * 2 * Math.PI - Math.PI / 2
    const x = CENTER + RADIUS * Math.cos(angle)
    const y = CENTER + RADIUS * Math.sin(angle)
    const completion = completions.find(c => c.day_number === day)
    const isCompleted = completion?.completed === true
    const isInStreak = streakDays.has(day)
    return { day, x, y, isCompleted, isInStreak }
  })

  function getNodeProps(node) {
    const { isCompleted, isInStreak, day } = node

    if (!isCompleted) {
      return { fill: '#E5E1D9', filter: 'none', r: NODE_R }
    }

    if (isInStreak) {
      const position = sortedStreak.indexOf(day) + 1
      const t = streakLength > 1 ? (position - 1) / (streakLength - 1) : 1
      // opacity scales 0.35 → 1.0 through the streak
      const fillOpacity = 0.35 + t * 0.65
      const glowSize = 4 + t * 14
      const glowOpacity = 0.25 + t * 0.55
      return {
        fill: `rgba(201, 168, 76, ${fillOpacity})`,
        filter: `drop-shadow(0 0 ${glowSize.toFixed(1)}px rgba(201, 168, 76, ${glowOpacity.toFixed(2)}))`,
        r: NODE_R + t * 1.5
      }
    }

    // Completed but streak was broken — dim gold, no glow
    return {
      fill: 'rgba(201, 168, 76, 0.28)',
      filter: 'drop-shadow(0 0 3px rgba(201, 168, 76, 0.15))',
      r: NODE_R
    }
  }

  return (
    <div className="visualizer">
      <div className="visualizer__svg-wrap">
        <svg
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          xmlns="http://www.w3.org/2000/svg"
          aria-label={`${winCount} wins out of 21 days`}
        >
          {/* Faint track ring */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="#DDD9D0"
            strokeWidth="1"
          />

          {nodes.map((node) => {
            const { fill, filter, r } = getNodeProps(node)
            return (
              <circle
                key={node.day}
                className="visualizer-node"
                cx={node.x}
                cy={node.y}
                r={r}
                fill={fill}
                style={{
                  filter,
                  animationDelay: `${node.day * 0.04}s`,
                  animation: 'nodeAppear 0.35s ease both'
                }}
              />
            )
          })}

          {/* Center: win count */}
          <text
            x={CENTER}
            y={CENTER - 12}
            textAnchor="middle"
            fill="#1C1916"
            fontSize="38"
            fontWeight="200"
            fontFamily="-apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif"
            letterSpacing="-1"
          >
            {winCount}
          </text>
          <text
            x={CENTER}
            y={CENTER + 14}
            textAnchor="middle"
            fill="#9A9590"
            fontSize="10"
            fontFamily="-apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif"
            letterSpacing="2"
          >
            WINS
          </text>
        </svg>
      </div>

      <div className="visualizer__stat">
        <div className="visualizer__multiplier">
          <span>{multiplier}</span>x
        </div>
        <div className="visualizer__stat-label">compounded</div>
      </div>

      <style>{`
        @keyframes nodeAppear {
          from { opacity: 0; transform-origin: ${CENTER}px ${CENTER}px; transform: scale(0.5); }
          to   { opacity: 1; transform-origin: ${CENTER}px ${CENTER}px; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
