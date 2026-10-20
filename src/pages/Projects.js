import { Link } from 'react-router-dom';
import { useSite, usePageTitle } from '../context';
import { projects } from '../content';
import { ArrowIcon, ExternalIcon, GitHubIcon, PlayIcon } from '../components/Icons';
import { PageHeader, ProjectCard, TagList } from '../components/ui';
import { Stagger } from '../components/motion';
import LaticeGame from '../components/LaticeGame';
import PythonGames from '../components/PythonGames';
import NetflixDemo from '../components/NetflixDemo';
import { MauiDemo, TaskAppDemo } from '../components/ProjectDemos';
import './pages.css';

// Projects with something to try in the browser. `recreated` marks web
// re-creations of apps whose original code (Kotlin, C#) cannot run here.
const DEMOS = [
  { id: 'netflix', Demo: NetflixDemo, recreated: true },
  { id: 'kotlin', Demo: TaskAppDemo, recreated: true },
  { id: 'maui', Demo: MauiDemo, recreated: true },
  { id: 'latice', Demo: LaticeGame },
  { id: 'python', Demo: PythonGames },
];

function DemoRow({ project, Demo, recreated }) {
  const { t, lang } = useSite();
  const p = t.projects;
  const fr = lang === 'fr';

  return (
    <article className="card demo-row reveal">
      <div className="demo-row__info">
        <div className="demo-row__head">
          <span className="project-card__icon" aria-hidden="true">
            {project.icon}
          </span>
          <div>
            <span className="project-card__cat">{p.filters[project.category]}</span>
            <h3 className="project-card__title">
              <Link to={`/projects/${project.id}`}>{project.title[lang]}</Link>
            </h3>
          </div>
        </div>
        <p className="project-card__desc">{project.desc[lang]}</p>
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
              ? 'Démo interactive · recréation web simplifiée de l’application'
              : 'Interactive demo · simplified web re-creation of the app'
            : fr
              ? 'Démo jouable'
              : 'Playable demo'}
        </p>
        <Demo />
      </div>
    </article>
  );
}

export default function Projects() {
  const { t, lang } = useSite();
  usePageTitle(t.projects.title);
  const fr = lang === 'fr';

  const demoIds = DEMOS.map((d) => d.id);
  const others = projects.filter((p) => !demoIds.includes(p.id));

  const lead = fr
    ? 'Des applications en production réalisées pendant mon stage, et des projets universitaires — dont cinq que vous pouvez essayer directement ici.'
    : 'Production apps built during my internship, and university projects — five of which you can try right here.';

  return (
    <>
      <PageHeader eyebrow={t.nav.projects} title={t.projects.title} lead={lead} robot="present" />

      <section className="container projects-section">
        <div className="section-title">
          <h2>{fr ? 'Applications réalisées' : 'Apps I built'}</h2>
        </div>
        <Stagger className="bento bento--projects">
          {others.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </Stagger>
      </section>

      <section className="container projects-section">
        <div className="section-title">
          <h2>{fr ? 'À essayer ici' : 'Try them here'}</h2>
        </div>
        <div className="demo-list">
          {DEMOS.map(({ id, Demo, recreated }) => (
            <DemoRow key={id} project={projects.find((p) => p.id === id)} Demo={Demo} recreated={recreated} />
          ))}
        </div>
      </section>
    </>
  );
}
