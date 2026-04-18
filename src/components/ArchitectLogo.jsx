export default function ArchitectLogo({ className = '' }) {
  return (
    <a
      href="https://thearchitectprograms.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`arch-logo ${className}`}
      aria-label="The Architect Programs"
    >
      <img className="arch-logo__mark" src="/icons/Gold.png" alt="Architect Programs" />
      <span className="arch-logo__wordmark">Architect</span>
    </a>
  )
}
