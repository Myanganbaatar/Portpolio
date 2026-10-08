import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSite, usePageTitle } from '../context';
import { links, projects } from '../content';
import { ArrowIcon, DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon, PinIcon } from '../components/Icons';
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

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now.toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', second: '2-digit' });
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
        <Stagger className="bento" step={0.05}>
          <Tile className="b-c2 b-r2 tile--intro" to="/about">
            <p className="eyebrow">{fr ? 'En bref' : 'In short'}</p>
            <p className="tile__lead">{h.pitch}</p>
            <span className="text-link">
              {u.moreAbout} <ArrowIcon width={16} height={16} />
            </span>
          </Tile>

          {h.stats.slice(0, 2).map((s) => (
            <Tile key={s.label} className="tile--stat">
              <span className="tile__big">
                <CountUp value={s.value} />
              </span>
              <span className="tile__muted">{s.label}</span>
            </Tile>
          ))}

          <Tile className="tile--clock">
            <span className="tile__label">
              <PinIcon width={14} height={14} /> Limoges, France
            </span>
            <span className="tile__clock">
              <Clock />
            </span>
            <span className="tile__muted">{fr ? 'heure locale' : 'local time'}</span>
          </Tile>

          <Tile className="tile--stat">
            <span className="tile__big">
              <CountUp value={h.stats[2].value} />
            </span>
            <span className="tile__muted">{h.stats[2].label}</span>
          </Tile>

          <Tile className="b-c2 tile--stack">
            <span className="tile__label">Stack</span>
            <div className="marquee" aria-label={STACK.join(', ')}>
              <div className="marquee__track">
                {[...STACK, ...STACK].map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
              <div className="marquee__track marquee__track--rev" aria-hidden="true">
                {[...STACK.slice().reverse(), ...STACK.slice().reverse()].map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
            </div>
          </Tile>

          <Tile className="b-c2 tile--services">
            <span className="tile__label">{u.whatIDo}</span>
            <ul className="tile__services">
              {u.services.map((s) => (
                <li key={s.title}>
                  <span aria-hidden="true">{s.icon}</span>
                  <strong>{s.title}</strong> — {s.text}
                </li>
              ))}
            </ul>
          </Tile>

          <Tile className="b-c2 b-r2 tile--featured" to={`/projects/${cms.id}`}>
            <span className="tile__label">{u.featured}</span>
            <pre className="tile__code" aria-hidden="true">
              <span className="c-kw">GET</span> /api/articles{'\n'}
              <span className="c-num">200</span> {'{ "title": "Mongolian Au Pair", … }'}
              {'\n'}
              <span className="c-kw">POST</span> /api/media <span className="c-num">201</span>
              {'\n'}
              <span className="c-str">admin</span> › drag &amp; drop editor
            </pre>
            <div>
              <h3 className="tile__title">
                {cms.title[lang]} <ArrowIcon width={18} height={18} />
              </h3>
              <p className="tile__muted">{cms.desc[lang]}</p>
              <TagList items={cms.tags} />
            </div>
          </Tile>

          {[python, latice].map((p) => (
            <Tile key={p.id} className="tile--project" to={`/projects/${p.id}`}>
              <span className="tile__icon" aria-hidden="true">
                {p.icon}
              </span>
              <h3 className="tile__title tile__title--sm">{p.title[lang]}</h3>
              {p.demo && <span className="tile__badge">▶ {t.projects.play}</span>}
            </Tile>
          ))}

          <Tile className="b-c2 tile--xp" to="/experience">
            <span className="tile__label">{t.experience.title}</span>
            <div className="tile__xp">
              <span className="xp-teaser__logo" aria-hidden="true">
                IT
              </span>
              <div>
                <h3 className="tile__title tile__title--sm">{t.experience.role}</h3>
                <p className="tile__muted">
                  {t.experience.company} · {t.experience.place} · {t.experience.date}
                </p>
              </div>
            </div>
          </Tile>

          <Tile className="tile--langs">
            <span className="tile__label">{fr ? 'Langues' : 'Languages'}</span>
            <ul className="tile__langs">
              <li>
                <span className="lang-code">MN</span> {fr ? 'Mongol · natif' : 'Mongolian · native'}
              </li>
              <li>
                <span className="lang-code">FR</span> {fr ? 'Français · intermédiaire' : 'French · intermediate'}
              </li>
              <li>
                <span className="lang-code">EN</span> {fr ? 'Anglais · intermédiaire' : 'English · intermediate'}
              </li>
            </ul>
          </Tile>

          <Tile className="tile--social">
            <span className="tile__label">{fr ? 'Retrouvez-moi' : 'Find me'}</span>
            <div className="hero__social">
              <a className="icon-btn" href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <GitHubIcon />
              </a>
              <a className="icon-btn" href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
              <a className="icon-btn" href={`mailto:${links.email}`} aria-label="Email">
                <MailIcon />
              </a>
            </div>
          </Tile>

          <Tile className="b-c2 tile--cta" to="/contact">
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
