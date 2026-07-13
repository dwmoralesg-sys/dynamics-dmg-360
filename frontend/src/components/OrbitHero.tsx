// Elemento distintivo de la marca: un orbital 360° donde las tres
// dimensiones del negocio (Negocio · Procesos · Tecnología) giran
// alrededor de un núcleo. Encarna la propuesta "solución 360°".
export function OrbitHero() {
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', maxWidth: 440, margin: '0 auto' }}>
      <style>{`
        @keyframes dmg-spin { to { transform: rotate(360deg); } }
        @keyframes dmg-spin-rev { to { transform: rotate(-360deg); } }
        .orbit-rotor { transform-origin: 50% 50%; animation: dmg-spin 40s linear infinite; }
        .orbit-rotor-slow { transform-origin: 50% 50%; animation: dmg-spin-rev 60s linear infinite; }
      `}</style>
      <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" role="img"
           aria-label="Orbital que conecta negocio, procesos y tecnología">
        {/* Anillos guía */}
        <circle cx="200" cy="200" r="150" stroke="var(--line)" strokeWidth="1" />
        <circle cx="200" cy="200" r="110" stroke="var(--line)" strokeWidth="1" strokeDasharray="3 6" />
        <circle cx="200" cy="200" r="70" stroke="var(--line)" strokeWidth="1" />

        {/* Rotor exterior: 3 nodos de dimensión */}
        <g className="orbit-rotor">
          <g>
            <circle cx="200" cy="50" r="9" fill="var(--gold)" />
            <circle cx="200" cy="50" r="18" stroke="var(--gold)" strokeWidth="1" opacity="0.4" />
          </g>
          <g>
            <circle cx="330" cy="275" r="9" fill="var(--violet)" />
            <circle cx="330" cy="275" r="18" stroke="var(--violet)" strokeWidth="1" opacity="0.4" />
          </g>
          <g>
            <circle cx="70" cy="275" r="9" fill="var(--teal)" />
            <circle cx="70" cy="275" r="18" stroke="var(--teal)" strokeWidth="1" opacity="0.4" />
          </g>
        </g>

        {/* Rotor interior en sentido inverso */}
        <g className="orbit-rotor-slow">
          <circle cx="200" cy="90" r="3.5" fill="var(--teal-soft)" />
          <circle cx="290" cy="255" r="3.5" fill="var(--gold-soft)" />
          <circle cx="110" cy="255" r="3.5" fill="var(--violet)" />
        </g>

        {/* Núcleo 360 */}
        <circle cx="200" cy="200" r="44" fill="var(--surface-2)" stroke="var(--line)" strokeWidth="1" />
        <text x="200" y="200" textAnchor="middle" dominantBaseline="central"
              fontFamily="var(--font-display)" fontSize="30" fontWeight="600" fill="var(--ink)">360</text>
      </svg>

      {/* Etiquetas fijas de las tres dimensiones */}
      <span style={labelStyle('12%', '50%', 'var(--gold)')}>Negocio</span>
      <span style={labelStyle('80%', '85%', 'var(--violet)')}>Procesos</span>
      <span style={labelStyle('80%', '15%', 'var(--teal)')}>Tecnología</span>
    </div>
  );
}

function labelStyle(top: string, left: string, color: string): React.CSSProperties {
  return {
    position: 'absolute', top, left, transform: 'translate(-50%, -50%)',
    fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em',
    textTransform: 'uppercase', color, whiteSpace: 'nowrap',
  };
}
