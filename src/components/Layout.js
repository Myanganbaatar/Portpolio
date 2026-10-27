import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSite, useStill } from '../context';
import { ScrollProgress } from './motion';
import PageWorld, { worldFor } from './PageWorld';
import RocketFlight, { preloadPlanetImages, takeSkipFlight } from './RocketFlight';
import { links } from '../content';
import { CloseIcon, DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon, MenuIcon, MoonIcon, PauseIcon, PlayIcon, SunIcon } from './Icons';
import './Layout.css';

const NAV = ['about', 'experience', 'projects', 'skills', 'contact'];

// Position of a page in the navigation order, so the slide goes the right way.
function pageIndex(pathname) {
  const first = pathname.split('/')[1] || '';
  if (!first) return 0;
  const i = NAV.indexOf(first);
  return i >= 0 ? i + 1 + (pathname.split('/').length > 2 ? 0.5 : 0) : NAV.length + 1;
}

function Navbar() {
  const { t, u, lang, setLang, theme, toggleTheme, motionOn, toggleMotion } = useSite();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner">
        <Link to="/" className="nav__logo" aria-label={u.home}>
          <span className="nav__mark">BM</span>
          <span className="nav__name">Barsbold</span>
        </Link>

        <nav className={`nav__links ${open ? 'is-open' : ''}`} aria-label="Navigation">
          {NAV.map((key) => (
            <NavLink key={key} to={`/${key}`} className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}>
              {t.nav[key]}
            </NavLink>
          ))}
          <a className="btn btn--primary btn--sm nav__cv" href={t.hero.cvHref} download>
            <DownloadIcon width={16} height={16} /> {t.nav.cv}
          </a>
        </nav>

        <div className="nav__tools">
          <div className="lang" role="group" aria-label="Language">
            {['fr', 'en'].map((l) => (
              <button key={l} className={`lang__btn ${lang === l ? 'is-active' : ''}`} onClick={() => setLang(l)} aria-pressed={lang === l}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="icon-btn" onClick={toggleMotion} aria-pressed={!motionOn} aria-label={motionOn ? u.motionOff : u.motionOn} title={motionOn ? u.motionOff : u.motionOn}>
            {motionOn ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button className="icon-btn" onClick={toggleTheme} aria-label={u.theme} title={u.theme}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button className="icon-btn nav__burger" onClick={() => setOpen((o) => !o)} aria-label={u.menu} aria-expanded={open}>
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const { t, u } = useSite();
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <Link to="/" className="nav__logo">
            <span className="nav__mark">BM</span>
            <span className="nav__name">Barsbold Myanganbaatar</span>
          </Link>
          <p className="footer__note">{t.footer} · {new Date().getFullYear()}</p>
          <a className="footer__source" href={`${links.github}/Portpolio`} target="_blank" rel="noreferrer">
            <GitHubIcon width={14} height={14} /> {t.footerSource}
          </a>
        </div>
        <nav className="footer__nav" aria-label="Footer">
          <Link to="/">{u.home}</Link>
          {NAV.map((key) => (
            <Link key={key} to={`/${key}`}>
              {t.nav[key]}
            </Link>
          ))}
        </nav>
        <div className="footer__social">
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
      </div>
    </footer>
  );
}

export default function Layout() {
  const { u, t } = useSite();
  const { pathname } = useLocation();
  const reduce = useStill();
  const world = worldFor();
  // Slide in from the right when moving forward in the menu, from the left when going back.
  const prevIndex = useRef(pageIndex(pathname));
  const index = pageIndex(pathname);
  const dir = index >= prevIndex.current ? 1 : -1;

  // Rocket ride to the new page's planet on every page change (not on first load).
  const [flight, setFlight] = useState(null);
  const firstPath = useRef(pathname);
  // Layout effect: the flag is set before the new page is painted.
  useLayoutEffect(() => {
    if (pathname === firstPath.current) {
      firstPath.current = null;
      return;
    }
    firstPath.current = null;
    if (takeSkipFlight() || reduce) return;
    const seg = pathname.split('/')[1] || '';
    const to = !seg ? 'home' : NAV.includes(seg) ? seg : 'other';
    const label = to === 'home' ? u.home || 'Accueil' : NAV.includes(seg) ? t.nav[seg] : '';
    document.body.dataset.flying = '1';
    setFlight({ id: Date.now(), to, label, back: dir < 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  // The page's robot scene stays hidden until the rocket has landed.
  // Paint the planet textures once the page is idle (they come with the 3D chunk).
  useEffect(() => {
    const id = setTimeout(preloadPlanetImages, 2500);
    return () => clearTimeout(id);
  }, []);
  const landFlight = useCallback(() => {
    delete document.body.dataset.flying;
  }, []);
  const endFlight = useCallback(() => {
    delete document.body.dataset.flying;
    setFlight(null);
  }, []);

  useEffect(() => {
    prevIndex.current = index;
  }, [index]);

  // Lets the stylesheet hide the generic starfield when a page has its own world.
  useEffect(() => {
    if (world) document.body.dataset.world = world;
    else delete document.body.dataset.world;
  }, [world]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="site">
      <a href="#main" className="skip-link">
        {u.skip}
      </a>
      <PageWorld world={world} />
      {flight && <RocketFlight key={flight.id} to={flight.to} label={flight.label} back={flight.back} shift={flight.back ? -80 : 80} onLanded={landFlight} onDone={endFlight} />}
      <ScrollProgress />
      <Navbar />
      <motion.main
        id="main"
        className="site__main"
        key={pathname}
        initial={reduce ? false : { opacity: 0, x: dir * 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
}
