import { useMemo } from 'react';
import { useSite } from '../context';
import SpaceDay from './PageWorldDay';
import './PageWorld.css';

// Full-screen animated backdrop shared by all pages: deep space at night,
// a dawn sky with the light theme. Drawn on a 1600×900 canvas.

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

/* ---------- Home: deep space with a meteor shower ---------- */

// Meteors: start position (% of the screen), delay and duration of each pass.
const METEORS = [
  { top: 6, left: 70, delay: 0, dur: 7 },
  { top: 2, left: 92, delay: 2.4, dur: 9 },
  { top: 18, left: 98, delay: 4.1, dur: 8 },
  { top: 0, left: 55, delay: 5.6, dur: 11 },
  { top: 10, left: 84, delay: 7.3, dur: 10 },
  { top: 28, left: 100, delay: 1.2, dur: 12 },
  { top: 4, left: 38, delay: 8.8, dur: 13 },
];

function Space() {
  // Dense, tiny stars along the Milky Way band (a diagonal strip).
  const band = useMemo(() => {
    const r = rng(42);
    return Array.from({ length: 260 }, () => {
      const t = r();
      const spread = (r() + r() + r() - 1.5) * 150;
      return { x: t * W, y: 760 - t * 620 + spread, s: 0.4 + r() * 0.9, o: 0.25 + r() * 0.6 };
    });
  }, []);
  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="sp-bg" cx="0.6" cy="0.45" r="0.9">
            <stop offset="0" stopColor="#0d0b1f" />
            <stop offset="1" stopColor="#030308" />
          </radialGradient>
          <linearGradient id="sp-band" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="rgba(150,140,255,0)" />
            <stop offset="0.35" stopColor="rgba(170,160,255,0.16)" />
            <stop offset="0.6" stopColor="rgba(255,200,230,0.14)" />
            <stop offset="1" stopColor="rgba(150,140,255,0)" />
          </linearGradient>
          <filter id="sp-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="40" />
          </filter>
        </defs>
        <rect width={W} height={H} fill="url(#sp-bg)" />
        {/* nebula clouds */}
        <g filter="url(#sp-blur)" className="world__nebula">
          <ellipse cx="1250" cy="170" rx="380" ry="200" fill="rgba(139,92,246,0.35)" />
          <ellipse cx="1420" cy="320" rx="260" ry="170" fill="rgba(236,72,153,0.22)" />
          <ellipse cx="1050" cy="80" rx="240" ry="120" fill="rgba(34,211,238,0.16)" />
          <ellipse cx="180" cy="820" rx="360" ry="200" fill="rgba(34,211,238,0.14)" />
          <ellipse cx="420" cy="760" rx="240" ry="140" fill="rgba(139,92,246,0.18)" />
        </g>
        {/* Milky Way */}
        <polygon points={`0,${H - 30} 0,${H - 300} ${W},0 ${W},270`} fill="url(#sp-band)" filter="url(#sp-blur)" />
        <g fill="#fff">
          {band.map((st, i) => (
            <circle key={i} cx={st.x} cy={st.y} r={st.s} opacity={st.o} />
          ))}
        </g>
        <Stars count={140} seed={17} maxY={H} />
        <g className="world__stars world__stars--big">
          {[
            [220, 120],
            [610, 300],
            [940, 90],
            [1480, 520],
            [760, 690],
            [1320, 820],
            [90, 470],
          ].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`} style={{ animationDelay: `${i * 0.7}s` }}>
              <circle r="2.2" />
              <path d="M-9 0 H9 M0 -9 V9" stroke="rgba(255,255,255,0.55)" strokeWidth="0.8" />
            </g>
          ))}
        </g>
      </svg>
      <div className="world__meteors">
        {METEORS.map((m, i) => (
          <span key={i} className="world__meteor" style={{ top: `${m.top}%`, left: `${m.left}%`, animationDelay: `${m.delay}s`, animationDuration: `${m.dur}s` }} />
        ))}
      </div>
    </>
  );
}


// Every page shares the same space backdrop (the 3D solar system stays on the home page).
// The world is not keyed by the path, so it stays in place while pages slide.
export function worldFor() {
  return 'space';
}

export default function PageWorld({ world }) {
  const { theme } = useSite();
  const day = theme === 'light';
  // Light theme shows the daytime version of the same world.
  const Scene = world === 'space' ? (day ? SpaceDay : Space) : null;
  if (!Scene) return null;
  return (
    <div key={`${world}-${theme}`} className={`world world--${world} ${day ? 'world--day' : ''}`} aria-hidden="true">
      <Scene />
      <div className="world__veil" />
    </div>
  );
}
