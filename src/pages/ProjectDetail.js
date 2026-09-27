import { Link, Navigate, useParams } from 'react-router-dom';
import { useSite, usePageTitle } from '../context';
import { projectDetails, projects } from '../content';
import { ArrowIcon, ExternalIcon, GitHubIcon, LockIcon, PlayIcon } from '../components/Icons';
import { CtaBanner, TagList } from '../components/ui';
import './pages.css';

export default function ProjectDetail() {
  const { id } = useParams();
  const { t, u, lang } = useSite();
  const index = projects.findIndex((p) => p.id === id);
  const project = projects[index];
  usePageTitle(project ? project.title[lang] : null);

  if (!project) return <Navigate to="/projects" replace />;

  const d = projectDetails[project.id];
  const next = projects[(index + 1) % projects.length];
  const p = t.projects;

  return (
    <>
      <header className="container detail-header reveal">
        <Link to="/projects" className="text-link text-link--muted">
          {u.backToProjects}
        </Link>
        <div className="detail-header__row">
          <span className="project-card__icon detail-header__icon" aria-hidden="true">
            {project.icon}
          </span>
          <span className="project-card__cat">{p.filters[project.category]}</span>
        </div>
        <h1 className="page-title">{project.title[lang]}</h1>
        <p className="page-lead">{project.desc[lang]}</p>
        <div className="detail-header__links">
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer" className="btn btn--primary">
              <ExternalIcon width={16} height={16} /> {p.live}
            </a>
          )}
          {project.demo && (
            <Link to={`/play/${project.demo}`} className="btn btn--primary">
              <PlayIcon width={16} height={16} /> {p.play}
            </Link>
          )}
          {project.code && (
            <a href={project.code} target="_blank" rel="noreferrer" className="btn">
              <GitHubIcon width={16} height={16} /> {p.code}
            </a>
          )}
          {project.private && (
            <span className="btn btn--ghost" aria-disabled="true">
              <LockIcon width={16} height={16} /> {p.private}
            </span>
          )}
        </div>
      </header>

      <section className="container detail-body reveal reveal-2">
        <div className="detail-main">
          <h2 className="sub-title">{u.context}</h2>
          <p className="detail-text">{d.context[lang]}</p>
          <h2 className="sub-title">{u.highlights}</h2>
          <ul className="check-list check-list--lg">
            {d.highlights[lang].map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
        <aside className="card detail-side">
          <h2 className="detail-side__title">{u.stack}</h2>
          <TagList items={d.stack} />
        </aside>
      </section>

      <section className="container">
        <Link to={`/projects/${next.id}`} className="card next-card">
          <div>
            <p className="eyebrow">{u.next}</p>
            <h3>
              {next.icon} {next.title[lang]}
            </h3>
          </div>
          <ArrowIcon className="xp-teaser__arrow" />
        </Link>
      </section>

      <CtaBanner />
    </>
  );
}
