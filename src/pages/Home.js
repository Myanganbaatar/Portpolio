import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSite, usePageTitle } from '../context';
import { projects } from '../content';
import { ArrowIcon, DownloadIcon } from '../components/Icons';
import { TagList } from '../components/ui';
import { CountUp, Stagger, staggerItem } from '../components/motion';
import './pages.css';

// three.js is heavy: the solar system lives in its own chunk.
const SpaceHero = lazy(() => import('../components/SpaceHero'));

const STACK = ['React', 'Next.js', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'Nginx', 'Java', 'Python', 'PHP', 'Kotlin', 'Git'];

function useWide(min = 921) {
  const query = `(min-width: ${min}px)`;
  const [wide, setWide] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return wide;
}


// Grid-span classes (b-*) go on the outer link so the grid can place it;
// every other class styles the tile itself.
function Tile({ className = '', children, to, href }) {
  const span = className.split(' ').filter((c) => c.startsWith('b-')).join(' ');
  const look = className.split(' ').filter((c) => c && !c.startsWith('b-')).join(' ');
  const tile = (
    <motion.div className={`tile ${to || href ? look : className}`} variants={staggerItem}>
      {children}
    </motion.div>
  );
  if (to) {
    return (
      <Link to={to} className={`tile-link ${span}`}>
        {tile}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={`tile-link ${span}`} target="_blank" rel="noreferrer">
        {tile}
      </a>
    );
  }
  return tile;
}

export default function Home() {
  const { t, u, lang, theme } = useSite();
  usePageTitle(null);
  const navigate = useNavigate();
  const wide = useWide();
  const [flying, setFlying] = useState(false);
  const h = t.hero;
  const fr = lang === 'fr';
  const cms = projects.find((p) => p.id === 'cms');
  const python = projects.find((p) => p.id === 'python');
  const latice = projects.find((p) => p.id === 'latice');

  return (
    <>
      <section className={`space-hero ${flying ? 'is-flying' : ''}`}>
        <div className="space-hero__stage" aria-hidden={!wide}>
          <Suspense fallback={null}>
            <SpaceHero theme={theme} labels={t.nav} shift={wide ? 0.3 : 0} onFly={() => setFlying(true)} onNavigate={(key) => navigate(`/${key}`)} />
          </Suspense>
        </div>
        <div className="container space-hero__content">
          <p className="status-pill reveal">
            <span className="status-dot" /> {h.status}
          </p>
          <h1 className="hero__title reveal reveal-2">
            <span className="hero__hello">{h.hello}</span>
            Barsbold <span className="gradient-text">Myanganbaatar</span>
          </h1>
          <p className="hero__role reveal reveal-2">{h.role}</p>
          <div className="hero__actions reveal reveal-3">
            <Link to="/projects" className="btn btn--primary">
              {h.cta} <ArrowIcon width={16} height={16} />
            </Link>
            <a href={h.cvHref} className="btn" download>
              <DownloadIcon width={16} height={16} /> {h.cv}
            </a>
          </div>
          <p className="space-hero__hint reveal reveal-3">
            {fr ? '🪐 Cliquez sur une planète · glissez pour faire tourner' : '🪐 Click a planet · drag to rotate'}
          </p>
        </div>
      </section>

      <section className="section container">
        <Stagger className="bento bento--home" step={0.06}>
          <Tile className="b-c2 b-r2 tile--intro" to="/about">
            <p className="eyebrow">{fr ? 'En bref' : 'In short'}</p>
            <p className="tile__lead">{h.pitch}</p>
            <span className="text-link">
              {u.moreAbout} <ArrowIcon width={16} height={16} />
            </span>
          </Tile>

          <Tile className="b-c2 tile--stats">
            {h.stats.map((s) => (
              <div key={s.label} className="tile__stat">
                <span className="tile__big">
                  <CountUp value={s.value} />
                </span>
                <span className="tile__muted">{s.label}</span>
              </div>
            ))}
          </Tile>

          <Tile className="b-c2 tile--stack">
            <span className="tile__label">Stack</span>
            <div className="marquee" aria-label={STACK.join(', ')}>
              <div className="marquee__track">
                {[...STACK, ...STACK].map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
            </div>
          </Tile>

          <Tile className="b-c2 tile--featured" to={`/projects/${cms.id}`}>
            <span className="tile__label">{u.featured}</span>
            <div>
              <h3 className="tile__title">
                {cms.title[lang]} <ArrowIcon width={18} height={18} />
              </h3>
              <p className="tile__muted">{cms.desc[lang]}</p>
            </div>
            <TagList items={cms.tags} />
          </Tile>

          <Tile className="b-c2 tile--games">
            <span className="tile__label">{fr ? 'Jouables ici' : 'Playable here'}</span>
            <div className="tile__games">
              {[python, latice].map((p) => (
                <Link key={p.id} to={`/play/${p.demo}`} className="tile__game">
                  <span className="tile__icon" aria-hidden="true">
                    {p.icon}
                  </span>
                  <span>
                    <strong>{p.title[lang]}</strong>
                    <span className="tile__badge">▶ {t.projects.play}</span>
                  </span>
                </Link>
              ))}
            </div>
          </Tile>

          <Tile className="b-c4 tile--cta" to="/contact">
            <h3 className="tile__title">{u.ctaTitle}</h3>
            <span className="tile__cta">
              {u.ctaButton} <ArrowIcon width={18} height={18} />
            </span>
          </Tile>
        </Stagger>
      </section>
    </>
  );
}
