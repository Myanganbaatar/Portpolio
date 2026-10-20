import { useMemo } from 'react';
import './PageWorld.css';

// Full-screen animated backdrop behind each inner page. Each "world" is an
// original illustration inspired by a superhero setting (no characters, names
// or logos). Drawn on a 1600×900 canvas anchored bottom-right, so the main
// motif stays visible on narrow screens.

const W = 1600;
const H = 900;

// Small deterministic random generator so the skylines never change between renders.
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function Stars({ count, seed, maxY = 500 }) {
  const stars = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: count }, () => ({ x: r() * W, y: r() * maxY, s: 0.6 + r() * 1.4, d: r() * 4 }));
  }, [count, seed, maxY]);
  return (
    <g className="world__stars">
      {stars.map((st, i) => (
        <circle key={i} cx={st.x} cy={st.y} r={st.s} style={{ animationDelay: `${st.d}s` }} />
      ))}
    </g>
  );
}

/* ---------- About: night city with webs ---------- */
function City() {
  const { buildings, windows } = useMemo(() => {
    const r = rng(7);
    const b = [];
    const w = [];
    let x = -20;
    while (x < W) {
      const width = 60 + r() * 110;
      const height = 140 + r() * 330 * (x > W * 0.45 ? 1.15 : 0.8);
      const top = H - height;
      b.push({ x, width, top, spire: r() > 0.8 });
      for (let wy = top + 18; wy < H - 20; wy += 26) {
        for (let wx = x + 12; wx < x + width - 12; wx += 20) {
          if (r() > 0.72) w.push({ x: wx, y: wy, d: r() * 6 });
        }
      }
      x += width + 4;
    }
    return { buildings: b, windows: w };
  }, []);

  const hub = [W, 0];
  const spokes = [
    [980, 520],
    [1120, 640],
    [1300, 700],
    [880, 330],
    [900, 120],
    [1480, 720],
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMaxYMax slice">
      <defs>
        <linearGradient id="city-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#070a1f" />
          <stop offset="0.55" stopColor="#1e1b4b" />
          <stop offset="1" stopColor="#4a1d4f" />
        </linearGradient>
        <radialGradient id="city-moon" cx="0.4" cy="0.4">
          <stop offset="0" stopColor="#fff9e6" />
          <stop offset="0.65" stopColor="#f3dca4" />
          <stop offset="1" stopColor="#d6b06a" />
        </radialGradient>
        <radialGradient id="city-halo">
          <stop offset="0" stopColor="rgba(255,230,170,0.35)" />
          <stop offset="1" stopColor="rgba(255,230,170,0)" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#city-sky)" />
      <Stars count={90} seed={3} maxY={480} />
      <circle cx="1250" cy="190" r="230" fill="url(#city-halo)" />
      <circle cx="1250" cy="190" r="95" fill="url(#city-moon)" />
      <g className="world__web" stroke="rgba(255,255,255,0.32)" strokeWidth="1.4" fill="none">
        {spokes.map(([x, y], i) => (
          <line key={i} x1={hub[0]} y1={hub[1]} x2={x} y2={y} />
        ))}
        {[0.25, 0.42, 0.6, 0.78].map((t) => (
          <polyline
            key={t}
            points={spokes
              .slice()
              .sort((a, b) => Math.atan2(a[1], W - a[0]) - Math.atan2(b[1], W - b[0]))
              .map(([x, y]) => `${W + (x - W) * t},${y * t}`)
              .join(' ')}
          />
        ))}
      </g>
      <g fill="#060818">
        {buildings.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={b.top} width={b.width} height={H - b.top} />
            {b.spire && <polygon points={`${b.x + b.width / 2 - 10},${b.top} ${b.x + b.width / 2},${b.top - 70} ${b.x + b.width / 2 + 10},${b.top}`} />}
          </g>
        ))}
      </g>
      <g className="world__windows" fill="#fde68a">
        {windows.map((w, i) => (
          <rect key={i} x={w.x} y={w.y} width="6" height="8" style={{ animationDelay: `${w.d}s` }} />
        ))}
      </g>
    </svg>
  );
}

/* ---------- Experience: high-tech armour lab ---------- */
function Lab() {
  const cx = 1180;
  const cy = 360;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMaxYMid slice">
      <defs>
        <radialGradient id="lab-bg" cx="0.74" cy="0.4" r="0.75">
          <stop offset="0" stopColor="#0c2f45" />
          <stop offset="0.7" stopColor="#050b14" />
        </radialGradient>
        <pattern id="lab-hex" width="42" height="72" patternUnits="userSpaceOnUse">
          <path d="M21 0 L42 12 L42 36 L21 48 L0 36 L0 12 Z M21 48 L21 72" fill="none" stroke="rgba(56,189,248,0.1)" />
        </pattern>
        <radialGradient id="lab-core">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#bae6fd" />
          <stop offset="1" stopColor="rgba(56,189,248,0)" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#lab-bg)" />
      <rect width={W} height={H} fill="url(#lab-hex)" />
      <g fill="none" stroke="#38bdf8">
        <circle className="world__spin" cx={cx} cy={cy} r="300" strokeWidth="2" strokeDasharray="70 22 8 22" opacity="0.45" />
        <circle className="world__spin world__spin--rev" cx={cx} cy={cy} r="240" strokeWidth="10" strokeDasharray="3 14" opacity="0.4" />
        <circle className="world__spin world__spin--fast" cx={cx} cy={cy} r="180" strokeWidth="2" strokeDasharray="160 50" opacity="0.7" />
        <circle cx={cx} cy={cy} r="120" strokeWidth="1" opacity="0.5" />
        <path d={`M${cx} ${cy - 370} V${cy - 320} M${cx} ${cy + 320} V${cy + 370} M${cx - 370} ${cy} H${cx - 320} M${cx + 320} ${cy} H${cx + 370}`} strokeWidth="2" opacity="0.6" />
      </g>
      <circle className="world__pulse" cx={cx} cy={cy} r="95" fill="url(#lab-core)" />
      <circle cx={cx} cy={cy} r="62" fill="none" stroke="#7dd3fc" strokeWidth="8" opacity="0.7" />
      <rect className="world__scan" x="0" y="0" width={W} height="3" fill="rgba(56,189,248,0.35)" />
      <g fontFamily="JetBrains Mono, monospace" fontSize="15" fill="#38bdf8" opacity="0.65">
        <text x={cx + 200} y={cy - 250}>SYS.ONLINE</text>
        <text x={cx - 330} y={cy - 230}>BUILD v3.0 · DEPLOY OK</text>
        <text x={cx + 170} y={cy + 290}>PWR 98%</text>
        <text x={cx - 310} y={cy + 300}>API 200 · 42ms</text>
      </g>
    </svg>
  );
}

/* ---------- Projects: futuristic city at sunset ---------- */
function FutureCity() {
  const towers = useMemo(() => {
    const r = rng(21);
    const t = [];
    let x = 380;
    while (x < W + 40) {
      const width = 70 + r() * 90;
      const height = 220 + r() * 380 * (x > 900 ? 1 : 0.7);
      t.push({ x, width, top: H - 110 - height, glow: r() > 0.45 });
      x += width + 18 + r() * 30;
    }
    return t;
  }, []);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMaxYMax slice">
      <defs>
        <linearGradient id="fc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#12061f" />
          <stop offset="0.4" stopColor="#4c1d95" />
          <stop offset="0.78" stopColor="#b45309" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
        <radialGradient id="fc-sun">
          <stop offset="0" stopColor="#fff3c4" />
          <stop offset="1" stopColor="rgba(253,230,138,0)" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#fc-sky)" />
      <Stars count={40} seed={11} maxY={260} />
      <circle cx="1180" cy="660" r="260" fill="url(#fc-sun)" opacity="0.8" />
      <g fill="#14072a">
        {towers.map((tw, i) => (
          <path key={i} d={`M${tw.x} ${H} V${tw.top + 40} Q${tw.x + tw.width / 2} ${tw.top - 40} ${tw.x + tw.width} ${tw.top + 40} V${H} Z`} />
        ))}
        <rect x="0" y={H - 110} width={W} height="110" />
      </g>
      <g className="world__glow" stroke="#c084fc" strokeWidth="3" fill="none">
        {towers
          .filter((tw) => tw.glow)
          .map((tw, i) => (
            <line key={i} x1={tw.x + tw.width / 2} y1={tw.top + 10} x2={tw.x + tw.width / 2} y2={H - 110} style={{ animationDelay: `${i * 0.4}s` }} />
          ))}
        <line x1="0" y1={H - 110} x2={W} y2={H - 110} stroke="#e9d5ff" strokeWidth="2" />
      </g>
      <g className="world__ships" fill="#e9d5ff">
        <rect x="-80" y="220" width="46" height="8" rx="4" />
        <rect x="-80" y="300" width="30" height="6" rx="3" style={{ animationDelay: '-7s', animationDuration: '22s' }} />
        <rect x="-80" y="170" width="24" height="5" rx="3" style={{ animationDelay: '-13s', animationDuration: '30s' }} />
      </g>
    </svg>
  );
}

/* ---------- Skills: golden realm, rainbow bridge, lightning ---------- */
function Realm() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMaxYMax slice">
      <defs>
        <radialGradient id="realm-sky" cx="0.7" cy="0.1" r="0.9">
          <stop offset="0" stopColor="#2c3e66" />
          <stop offset="0.7" stopColor="#0c1222" />
        </radialGradient>
        <linearGradient id="realm-bridge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ef4444" />
          <stop offset="0.2" stopColor="#f59e0b" />
          <stop offset="0.4" stopColor="#facc15" />
          <stop offset="0.6" stopColor="#22c55e" />
          <stop offset="0.8" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="realm-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#realm-sky)" />
      <Stars count={70} seed={5} maxY={520} />
      <rect className="world__flash" width={W} height={H} fill="#e0f2fe" />
      <polygon points={`0,${H} 330,${H} 1170,575 1130,570`} fill="url(#realm-bridge)" opacity="0.7" />
      <g fill="url(#realm-gold)">
        <polygon points="1130,580 1160,380 1190,580" />
        <polygon points="1200,580 1240,300 1280,580" />
        <polygon points="1290,580 1340,200 1390,580" />
        <polygon points="1400,580 1440,320 1480,580" />
        <polygon points="1490,580 1520,410 1550,580" />
        <rect x="1110" y="575" width="470" height="30" />
      </g>
      <rect x="1110" y="605" width="470" height={H - 605} fill="#0a0f1e" />
      <polygon className="world__bolt" points="860,0 815,150 850,150 790,320 900,110 862,110 905,0" fill="#e0f2fe" />
      <polygon className="world__bolt world__bolt--late" points="520,0 495,90 518,90 480,200 552,70 528,70 556,0" fill="#e0f2fe" />
    </svg>
  );
}

/* ---------- Contact: mystic portal ---------- */
function Mystic() {
  const cx = 1180;
  const cy = 380;
  const hex = (r, rot = 0) =>
    [0, 1, 2]
      .map((i) => {
        const a = rot + (i * 2 * Math.PI) / 3 - Math.PI / 2;
        return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
      })
      .join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMaxYMid slice">
      <defs>
        <radialGradient id="mys-bg" cx="0.74" cy="0.42" r="0.7">
          <stop offset="0" stopColor="#2a1240" />
          <stop offset="0.7" stopColor="#07060c" />
        </radialGradient>
        <radialGradient id="mys-core">
          <stop offset="0" stopColor="rgba(251,146,60,0.45)" />
          <stop offset="1" stopColor="rgba(251,146,60,0)" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#mys-bg)" />
      <Stars count={60} seed={9} maxY={H} />
      <circle cx={cx} cy={cy} r="260" fill="url(#mys-core)" />
      <g fill="none" stroke="#fb923c">
        <g className="world__spin world__spin--slow">
          <circle cx={cx} cy={cy} r="330" strokeWidth="3" opacity="0.75" />
          <circle cx={cx} cy={cy} r="305" strokeWidth="1.5" strokeDasharray="4 10" opacity="0.7" />
          <polygon points={hex(305)} strokeWidth="2" opacity="0.55" />
          <polygon points={hex(305, Math.PI)} strokeWidth="2" opacity="0.55" />
        </g>
        <g className="world__spin world__spin--rev">
          <circle cx={cx} cy={cy} r="200" strokeWidth="5" strokeDasharray="30 16" opacity="0.9" />
          <rect x={cx - 140} y={cy - 140} width="280" height="280" strokeWidth="2" opacity="0.55" />
          <rect x={cx - 140} y={cy - 140} width="280" height="280" strokeWidth="2" opacity="0.55" transform={`rotate(45 ${cx} ${cy})`} />
        </g>
        <circle className="world__pulse" cx={cx} cy={cy} r="80" strokeWidth="3" opacity="0.9" />
      </g>
      <g className="world__spin world__spin--fast" fill="#fdba74">
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <circle key={i} cx={cx + Math.cos(a) * 365} cy={cy + Math.sin(a) * 365} r={i % 3 ? 2.5 : 4.5} />;
        })}
      </g>
    </svg>
  );
}

const WORLDS = { city: City, lab: Lab, future: FutureCity, realm: Realm, mystic: Mystic };

export function worldFor(pathname) {
  if (pathname.startsWith('/about')) return 'city';
  if (pathname.startsWith('/experience')) return 'lab';
  if (pathname.startsWith('/projects')) return 'future';
  if (pathname.startsWith('/skills')) return 'realm';
  if (pathname.startsWith('/contact')) return 'mystic';
  return null;
}

export default function PageWorld({ world }) {
  const Scene = WORLDS[world];
  if (!Scene) return null;
  return (
    <div className={`world world--${world}`} aria-hidden="true">
      <Scene />
      <div className="world__veil" />
    </div>
  );
}
