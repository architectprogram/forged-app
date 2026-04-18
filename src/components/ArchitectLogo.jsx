export default function ArchitectLogo({ className = '' }) {
  return (
    <a
      href="https://thearchitectprograms.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`arch-logo ${className}`}
      aria-label="The Architect Programs"
    >
      <svg className="arch-logo__mark" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon
          points="256,72 452,432 60,432"
          fill="none"
          stroke="#C9A84C"
          strokeWidth="32"
          strokeLinejoin="round"
        />
        <line
          x1="152" y1="312" x2="360" y2="312"
          stroke="#C9A84C"
          strokeWidth="32"
          strokeLinecap="round"
        />
      </svg>
      <span className="arch-logo__wordmark">Architect</span>
    </a>
  )
}
