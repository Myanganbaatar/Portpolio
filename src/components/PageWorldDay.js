// Daytime version of the home backdrop, shown with the light theme.

const W = 1600;
const H = 900;

function Clouds({ id, items, blur = 14 }) {
  return (
    <>
      <defs>
        <filter id={id} x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation={blur} />
        </filter>
      </defs>
      <g fill="#fff" opacity="0.9" filter={`url(#${id})`}>
        {items.map(([cx, cy, rx, ry, delay, slow], i) => (
          <g key={i} className={`world__drift ${slow ? 'world__drift--slow' : ''}`} style={{ animationDelay: `${delay}s` }}>
            <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
            <ellipse cx={cx + rx * 0.45} cy={cy - ry * 0.4} rx={rx * 0.6} ry={ry} />
          </g>
        ))}
      </g>
    </>
  );
}

/* ---------- Home: dawn sky ---------- */
export default function SpaceDay() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="d-dawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a5b4fc" />
          <stop offset="0.55" stopColor="#f5d0fe" />
          <stop offset="1" stopColor="#fed7aa" />
        </linearGradient>
        <radialGradient id="d-dawn-sun">
          <stop offset="0" stopColor="rgba(255,237,213,1)" />
          <stop offset="1" stopColor="rgba(255,237,213,0)" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#d-dawn)" />
      <circle cx="1200" cy="820" r="460" fill="url(#d-dawn-sun)" />
      <circle cx="1400" cy="140" r="44" fill="#fff" opacity="0.75" />
      <circle cx="980" cy="110" r="16" fill="#c4b5fd" opacity="0.8" />
      <Clouds
        id="d-c-home"
        blur={18}
        items={[
          [200, 300, 220, 50, 0],
          [700, 640, 260, 60, -12, true],
          [400, 790, 280, 60, -20],
          [1250, 220, 200, 45, -6, true],
        ]}
      />
    </svg>
  );
}

