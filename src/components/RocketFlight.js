import { useEffect, useLayoutEffect, useState } from 'react';
import { PAGE_PLANET, PAGE_ROBOT, planetOnScreen } from './robotLayout';
import './RocketFlight.css';

// Page transition: the robot rides a small rocket to the planet of the page being
// opened. The planet appears exactly where that page's 3D robot stands (same
// texture as the home solar system), and the rocket lands on top of it.

export const FLIGHT_MS = 1300;

// The home page's 3D rocket already flew to the planet: skip the next 2D flight.
let skip = false;
export function skipNextFlight() {
  skip = true;
}
export function takeSkipFlight() {
  const s = skip;
  skip = false;
  return s;
}

// Planet textures painted once by spaceMaterials (loaded with the 3D chunk).
const images = {};
export function preloadPlanetImages() {
  import('./spaceMaterials').then(({ planetImage }) => {
    Object.entries(PAGE_ROBOT).forEach(([page, mode]) => {
      const p = PAGE_PLANET[mode];
      if (!images[page]) images[page] = planetImage(p.kind, p.seed);
    });
  });
}

// Where the planet and the landing point are, in viewport pixels.
function measure(to, shift) {
  const slot = document.querySelector('.page-header--robot .robot-slot');
  const mode = PAGE_ROBOT[to];
  if (!slot || !mode) return null;
  const box = slot.getBoundingClientRect();
  const left = box.left - shift; // the new page is still sliding in
  const p = planetOnScreen(mode, box.width, box.height);
  return {
    clip: { left, top: box.top, width: box.width, height: box.height },
    planet: { x: p.x, y: p.y, r: p.r },
    land: { x: left + p.x, y: box.top + p.topY },
  };
}

export default function RocketFlight({ to, label, back, shift = 0, onLanded, onDone }) {
  const [geo, setGeo] = useState(undefined);

  useLayoutEffect(() => {
    setGeo(measure(to, shift));
  }, [to, shift]);

  // Landed: the page's own 3D planet fades in under ours, then ours goes away.
  useEffect(() => {
    const a = setTimeout(onLanded, FLIGHT_MS);
    const b = setTimeout(onDone, FLIGHT_MS + 400);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [onLanded, onDone]);

  if (geo === undefined) return null;
  const cfg = PAGE_PLANET[PAGE_ROBOT[to]];
  const w = window.innerWidth;
  const h = window.innerHeight;
  // land on the planet; without a robot scene (home…) aim at the upper right
  const land = geo ? geo.land : { x: w * 0.78, y: h * 0.32 };
  const start = { x: back ? w * 0.96 : w * 0.04, y: h * 0.92 };
  const mid = { x: (start.x + land.x) / 2, y: Math.min(start.y, land.y) - h * 0.12 };
  const flip = land.x < start.x;

  return (
    <div className="flight" aria-hidden="true">
      {geo ? (
        <div className="flight__clip" style={{ left: geo.clip.left, top: geo.clip.top, width: geo.clip.width, height: geo.clip.height }}>
          <div
            className={`flight__planet ${cfg.ring ? 'flight__planet--ring' : ''}`}
            style={{
              left: geo.planet.x - geo.planet.r,
              top: geo.planet.y - geo.planet.r,
              width: geo.planet.r * 2,
              height: geo.planet.r * 2,
              '--glow': cfg.glow,
              '--d': `${geo.planet.r * 2}px`,
              backgroundImage: images[to] ? `url(${images[to]})` : undefined,
            }}
          />
        </div>
      ) : (
        <div className={`flight__sun ${to === 'home' ? '' : 'flight__sun--grey'}`} style={{ left: land.x, top: land.y }} />
      )}
      <span className="flight__label" style={{ left: land.x, top: land.y - 70 }}>
        {label}
      </span>
      <div
        className={`flight__rocket ${flip ? 'flight__rocket--flip' : ''}`}
        style={{
          '--x0': `${start.x}px`,
          '--y0': `${start.y}px`,
          '--x1': `${mid.x}px`,
          '--y1': `${mid.y}px`,
          '--x2': `${land.x}px`,
          '--y2': `${land.y}px`,
        }}
      >
        <svg viewBox="0 0 120 64" width="120" height="64">
          <path className="flight__flame" d="M22 32 L0 24 Q8 32 0 40 Z" fill="#ffb347" />
          <path className="flight__flame flight__flame--in" d="M22 32 L8 28 Q12 32 8 36 Z" fill="#fff3b0" />
          <path d="M34 20 L22 6 L46 18 Z" fill="#ff5c7a" />
          <path d="M34 44 L22 58 L46 46 Z" fill="#ff5c7a" />
          <path d="M22 22 Q22 18 30 18 L84 18 Q112 22 118 32 Q112 42 84 46 L30 46 Q22 46 22 42 Z" fill="#eef1f7" />
          <path d="M98 21 Q112 24 118 32 Q112 40 98 43 Z" fill="#a78bfa" />
          <circle cx="66" cy="32" r="12" fill="#2b303c" />
          <circle cx="66" cy="32" r="9.5" fill="#0b0d12" />
          <rect x="60" y="29" width="3.4" height="6" rx="1.7" fill="#22d3ee" />
          <rect x="68.6" y="29" width="3.4" height="6" rx="1.7" fill="#22d3ee" />
          <circle cx="44" cy="32" r="3" fill="#a78bfa" />
        </svg>
      </div>
    </div>
  );
}
