import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSite, usePageTitle } from '../context';
import { projects } from '../content';
import demoGuides from '../demoGuides';
import { ArrowIcon, ExternalIcon, GitHubIcon, PlayIcon } from '../components/Icons';
import { PageHeader, ProjectCard, ProjectImage, RobotSlot, TagList } from '../components/ui';
import { Stagger } from '../components/motion';
import LaticeGame from '../components/LaticeGame';
import PythonGames from '../components/PythonGames';
import NetflixDemo from '../components/NetflixDemo';
import { MauiDemo, QuestionaryDemo, TaskAppDemo } from '../components/ProjectDemos';
import { AuPairDemo, CmsDemo, ShortenerDemo } from '../components/InternshipDemos';
import './pages.css';

// Projects with something to try in the browser. `recreated` marks web
// re-creations of apps whose original code (private, Kotlin, C#, PHP) cannot run here.
const DEMOS = [
  { id: 'cms', Demo: CmsDemo, recreated: true },
  { id: 'aupair', Demo: AuPairDemo, recreated: true },
  { id: 'correcturl', Demo: ShortenerDemo, recreated: true },
  { id: 'latice', Demo: LaticeGame },
  { id: 'python', Demo: PythonGames },
  { id: 'questionary', Demo: QuestionaryDemo, recreated: true },
  { id: 'netflix', Demo: NetflixDemo, recreated: true },
  { id: 'kotlin', Demo: TaskAppDemo, recreated: true },
  { id: 'maui', Demo: MauiDemo, recreated: true },
];

// Filters: project type, then main technology (matched against each project's tags).
const TYPES = ['all', 'internship', 'university', 'demo'];
const TECHS = [
  { key: 'react', label: 'React / Next.js', match: (t) => /^(React|Next\.js)/.test(t) },
  { key: 'node', label: 'Node.js', match: (t) => t === 'Node.js' || t === 'Express' },
  { key: 'php', label: 'PHP', match: (t) => t === 'PHP' },
  { key: 'java', label: 'Java', match: (t) => t === 'Java' || t === 'JavaFX' },
  { key: 'python', label: 'Python', match: (t) => t === 'Python' },
  { key: 'db', label: { fr: 'Bases de données', en: 'Databases' }, match: (t) => /PostgreSQL|MariaDB|MongoDB|MySQL/.test(t) },
  { key: 'docker', label: 'Docker', match: (t) => t === 'Docker' },
  { key: 'mobile', label: 'Mobile (Kotlin, C#)', match: (t) => /Kotlin|Android|MAUI|C#/.test(t) },
];

const hasDemo = (id) => DEMOS.some((d) => d.id === id);

function matches(project, type, tech) {
  if (type === 'demo' && !hasDemo(project.id)) return false;
  if (type !== 'all' && type !== 'demo' && project.category !== type) return false;
  const t = TECHS.find((x) => x.key === tech);
  return !t || project.tags.some(t.match);
}

// Each block is a little fainter than the previous one (same dark blue).
const FADE = [1, 0.8, 0.64, 0.5, 0.4, 0.32, 0.26, 0.21, 0.17];

function DemoRow({ project, Demo, recreated, index }) {
  const { t, lang } = useSite();
  const p = t.projects;
  const fr = lang === 'fr';
  const guide = demoGuides[project.id] && demoGuides[project.id][lang];
  // The demo only mounts on request: the list stays short and light.
  const [open, setOpen] = useState(false);

  return (
    <article
      id={`demo-${project.id}`}
      className={`demo-row reveal ${index % 2 ? 'demo-row--flip' : ''}`}
      style={{ '--a': FADE[Math.min(index, FADE.length - 1)] }}
    >
      <div className="demo-row__text">
        <span className="demo-row__num" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="project-card__cat">{p.filters[project.category]}</span>
        <h3 className="demo-row__title">
          <Link to={`/projects/${project.id}`}>{project.title[lang]}</Link>
        </h3>

        {guide ? (
          <>
            <p className="demo-row__what">{guide.what}</p>
            <h4 className="demo-row__h">{fr ? 'À quoi ça sert ?' : 'What is it for?'}</h4>
            <p>{guide.why}</p>
            <h4 className="demo-row__h">{fr ? 'Ce que j’ai fait' : 'What I did'}</h4>
            <ul className="demo-row__did">
              {guide.did.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="demo-row__what">{project.desc[lang]}</p>
        )}

        <p className="demo-row__res">✓ {project.result[lang]}</p>
        <TagList items={project.tags} />
        <div className="demo-row__links">
          <Link to={`/projects/${project.id}`} className="link-chip">
            <ArrowIcon width={15} height={15} /> {fr ? 'Détails' : 'Details'}
          </Link>
          {project.demo && (
            <Link to={`/play/${project.demo}`} className="link-chip link-chip--accent">
              <PlayIcon width={15} height={15} /> {fr ? 'Plein écran' : 'Full screen'}
            </Link>
          )}
          {project.code && (
            <a href={project.code} target="_blank" rel="noreferrer" className="link-chip">
              <GitHubIcon width={15} height={15} /> {p.code}
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer" className="link-chip">
              <ExternalIcon width={15} height={15} /> {p.live}
            </a>
          )}
        </div>
      </div>

      <div className="demo-row__stage">
        <p className="demo-row__label">
          <span className="status-dot" />{' '}
          {recreated
            ? fr
              ? 'Démo interactive · recréation web de l’application'
              : 'Interactive demo · web re-creation of the app'
            : fr
              ? 'Démo jouable'
              : 'Playable demo'}
        </p>
        {guide && (
          <div className="demo-row__try">
            <p>{fr ? 'Essayez :' : 'Try it:'}</p>
            <ol>
              {guide.steps.map((st) => (
                <li key={st}>{st}</li>
              ))}
            </ol>
          </div>
        )}
        {open ? (
          <div className="demo-row__live">
            <Demo />
          </div>
        ) : (
          <div className="demo-row__poster">
            <ProjectImage project={project} />
            <button className="btn btn--primary demo-row__play" onClick={() => setOpen(true)} aria-label={`${fr ? 'Essayer la démo' : 'Try the demo'} : ${project.title[lang]}`}>
              <PlayIcon width={16} height={16} /> {fr ? 'Essayer la démo' : 'Try the demo'}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

// A small robot that follows the visitor down the list: it sits beside the project
// in the middle of the screen, staying in view while that block scrolls by.
function DemoBuddy({ listRef }) {
  const [pos, setPos] = useState(null); // { top, flip, shown }
  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rows = [...list.querySelectorAll('.demo-row')];
      const focus = window.innerHeight * 0.4;
      const box = list.getBoundingClientRect();
      // only around the list; in between two blocks it keeps following (no reset)
      const shown = box.top < focus && box.bottom > focus;
      // the block nearest to the focus line
      let row = rows[0];
      let best = Infinity;
      rows.forEach((r) => {
        const b = r.getBoundingClientRect();
        const d = b.top > focus ? b.top - focus : b.bottom < focus ? focus - b.bottom : 0;
        if (d < best) {
          best = d;
          row = r;
        }
      });
      const wanted = 110 - box.top; // keep it near the top of the screen
      const top = Math.min(Math.max(wanted, row.offsetTop - 64), row.offsetTop + row.offsetHeight - 200);
      setPos((prev) => ({ top: shown ? top : prev ? prev.top : top, flip: row.classList.contains('demo-row--flip'), shown }));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    const ro = new ResizeObserver(onScroll);
    ro.observe(list);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      ro.disconnect();
    };
  }, [listRef]);
  return (
    <div
      className={`demo-buddy ${pos && pos.flip ? 'demo-buddy--flip' : ''} ${pos && pos.shown ? '' : 'is-hidden'}`}
      style={{ transform: `translateY(${pos ? pos.top : 0}px)` }}
      aria-hidden="true"
    >
      <RobotSlot mode="buddy" />
    </div>
  );
}

export default function Projects() {
  const { t, lang } = useSite();
  usePageTitle(t.projects.title);
  const fr = lang === 'fr';

  const listRef = useRef(null);
  const [params, setParams] = useSearchParams();
  const type = TYPES.includes(params.get('type')) ? params.get('type') : 'all';
  const tech = TECHS.some((x) => x.key === params.get('tech')) ? params.get('tech') : null;
  const setFilter = (next) => {
    const merged = { type, tech, ...next };
    const out = {};
    if (merged.type !== 'all') out.type = merged.type;
    if (merged.tech) out.tech = merged.tech;
    setParams(out, { replace: true });
  };

  const shown = projects.filter((p) => matches(p, type, tech));
  const others = shown.filter((p) => !hasDemo(p.id));
  const demos = DEMOS.filter((d) => shown.some((p) => p.id === d.id));
  const label = (l) => (typeof l === 'string' ? l : l[lang]);

  const lead = fr
    ? 'Des applications en production réalisées pendant mon stage, et des projets universitaires — dont neuf que vous pouvez essayer directement ici.'
    : 'Production apps built during my internship, and university projects — nine of which you can try right here.';

  return (
    <>
      <PageHeader eyebrow={t.nav.projects} title={t.projects.title} lead={lead} robot="projector" />

      <section className="container project-filters reveal reveal-2" aria-label={fr ? 'Filtrer les projets' : 'Filter projects'}>
        <div className="filters" role="group" aria-label="Type">
          {TYPES.map((f) => (
            <button key={f} className={`filter ${type === f ? 'is-active' : ''}`} aria-pressed={type === f} onClick={() => setFilter({ type: f })}>
              {t.projects.filters[f]}{' '}
              <span className="filter__count">{projects.filter((p) => matches(p, f, tech)).length}</span>
            </button>
          ))}
        </div>
        <div className="filters filters--tech" role="group" aria-label={fr ? 'Technologie' : 'Technology'}>
          <span className="filters__label">{fr ? 'Technologie' : 'Technology'}</span>
          {TECHS.map((x) => {
            const n = projects.filter((p) => matches(p, type, x.key)).length;
            return (
              <button
                key={x.key}
                className={`filter filter--sm ${tech === x.key ? 'is-active' : ''}`}
                aria-pressed={tech === x.key}
                disabled={!n && tech !== x.key}
                onClick={() => setFilter({ tech: tech === x.key ? null : x.key })}
              >
                {label(x.label)} <span className="filter__count">{n}</span>
              </button>
            );
          })}
        </div>
        <p className="filters__result" aria-live="polite">
          {fr ? `${shown.length} projet${shown.length > 1 ? 's' : ''} affiché${shown.length > 1 ? 's' : ''}` : `${shown.length} project${shown.length > 1 ? 's' : ''} shown`}
          {(type !== 'all' || tech) && (
            <button className="filters__reset" onClick={() => setParams({}, { replace: true })}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              {fr ? 'Réinitialiser les filtres' : 'Reset filters'}
            </button>
          )}
        </p>
      </section>

      {shown.length === 0 && (
        <p className="container filters__empty">
          {fr ? 'Aucun projet ne correspond à ces filtres.' : 'No project matches these filters.'}
        </p>
      )}

      {others.length > 0 && (
        <section className="container projects-section">
          <div className="section-title">
            <h2>{fr ? 'Applications réalisées' : 'Apps I built'}</h2>
          </div>
          <Stagger key={`${type}-${tech}`} className="bento bento--projects">
            {others.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </Stagger>
        </section>
      )}

      {demos.length > 0 && (
        <section className="container projects-section">
          <div className="section-title">
            <h2>{fr ? 'À essayer ici' : 'Try them here'}</h2>
          </div>
          <div className="demo-list" ref={listRef}>
            <DemoBuddy listRef={listRef} />
            {demos.map(({ id, Demo, recreated }, i) => (
              <DemoRow key={id} index={i} project={projects.find((p) => p.id === id)} Demo={Demo} recreated={recreated} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
