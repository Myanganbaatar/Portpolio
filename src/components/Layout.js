import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useSite } from '../context';
import { ScrollProgress } from './motion';
import { links } from '../content';
import { CloseIcon, DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon, MenuIcon, MoonIcon, PhoneIcon, PinIcon, SunIcon } from './Icons';
import './Layout.css';

const NAV = ['about', 'experience', 'projects', 'skills', 'contact'];

function Navbar() {
  const { t, u, lang, setLang, theme, toggleTheme } = useSite();
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

// Name + contact details pinned to the side of every page (bottom bar on small screens).
function ProfileRail() {
  const { t, lang } = useSite();
  const fr = lang === 'fr';
  const items = [
    { icon: <MailIcon />, label: 'Email', value: links.email, href: `mailto:${links.email}` },
    { icon: <PhoneIcon />, label: fr ? 'Téléphone' : 'Phone', value: links.phone, href: links.phoneHref },
    { icon: <LinkedInIcon />, label: 'LinkedIn', value: 'barsbold-myanganbaatar', href: links.linkedin, external: true },
    { icon: <GitHubIcon />, label: 'GitHub', value: 'Myanganbaatar', href: links.github, external: true },
    { icon: <PinIcon />, label: fr ? 'Localisation' : 'Location', value: 'Limoges, France' },
  ];

  return (
    <aside className="rail" aria-label={fr ? 'Coordonnées' : 'Contact details'}>
      <div className="rail__id">
        <span className="nav__mark rail__mark">BM</span>
        <div>
          <p className="rail__name">Barsbold Myanganbaatar</p>
          <p className="rail__role">{fr ? 'Développeur web full-stack' : 'Full-stack web developer'}</p>
        </div>
      </div>
      <p className="rail__status">
        <span className="status-dot" /> {fr ? 'Stage dès mars 2027' : 'Internship from March 2027'}
      </p>
      <ul className="rail__list">
        {items.map((it) => {
          const inner = (
            <>
              <span className="rail__icon" aria-hidden="true">
                {it.icon}
              </span>
              <span className="rail__text">
                <span className="rail__label">{it.label}</span>
                <span className="rail__value">{it.value}</span>
              </span>
            </>
          );
          return (
            <li key={it.label} className={it.href ? '' : 'rail__item--static'}>
              {it.href ? (
                <a href={it.href} className="rail__item" title={it.value} {...(it.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
                  {inner}
                </a>
              ) : (
                <span className="rail__item">{inner}</span>
              )}
            </li>
          );
        })}
      </ul>
      <a className="btn btn--primary btn--sm rail__cv" href={t.hero.cvHref} download>
        <DownloadIcon width={16} height={16} /> {t.nav.cv}
      </a>
    </aside>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="site site--rail">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollProgress />
      <Navbar />
      <ProfileRail />
      <motion.main
        id="main"
        className="site__main"
        key={pathname}
        initial={reduce ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
}
