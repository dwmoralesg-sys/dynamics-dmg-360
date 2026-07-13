export function Logo({ size = 30 }: { size?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 11 }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden>
        <circle cx="20" cy="20" r="17" stroke="var(--line)" strokeWidth="1.5" />
        <path d="M20 3a17 17 0 0 1 0 34" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M20 37a17 17 0 0 1 0-34" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
        <circle cx="20" cy="20" r="4" fill="var(--ink)" />
      </svg>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, letterSpacing: '-0.01em' }}>
        Dynamics <span style={{ color: 'var(--gold)' }}>DMG</span> 360
      </span>
    </span>
  );
}
