import { Link } from 'react-router-dom';
import { useSite } from '../context';
import { ArrowIcon, ExternalIcon, GitHubIcon, LockIcon, PlayIcon } from './Icons';

export function Tag({ children }) {
  return <span className="tag">{children}</span>;
}

export function TagList({ items }) {
  return (
    <div className="tag-list">
      {items.map((item) => (
        <Tag key={item}>{item}</Tag>
      ))}
    </div>
  );
}

export function PageHeader({ eyebrow, title, lead }) {
  return (
    <header className="page-header container reveal">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="page-title">{title}</h1>
      {lead && <p className="page-lead">{lead}</p>}
    </header>
  );
}

export function SectionTitle({ eyebrow, title, action }) {
  return (
    <div className="section-title">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function ProjectCard({ project }) {
  const { lang, t } = useSite();
  const p = t.projects;
  return (
    <article className="card project-card">
      <Link to={`/projects/${project.id}`} className="project-card__main">
        <div className="project-card__top">
          <span className="project-card__icon" aria-hidden="true">
            {project.icon}
          </span>
          <span className="project-card__cat">{p.filters[project.category]}</span>
        </div>
        <h3 className="project-card__title">
          {project.title[lang]}
          <ArrowIcon className="project-card__arrow" width={18} height={18} />
        </h3>
        <p className="project-card__desc">{project.desc[lang]}</p>
        <TagList items={project.tags} />
      </Link>
      <div className="project-card__links">
        {project.live && (
          <a href={project.live} target="_blank" rel="noreferrer" className="link-chip">
            <ExternalIcon width={15} height={15} /> {p.live}
          </a>
        )}
        {project.demo && (
          <Link to={`/play/${project.demo}`} className="link-chip link-chip--accent">
            <PlayIcon width={15} height={15} /> {p.play}
          </Link>
        )}
        {project.code && (
          <a href={project.code} target="_blank" rel="noreferrer" className="link-chip">
            <GitHubIcon width={15} height={15} /> {p.code}
          </a>
        )}
        {project.private && (
          <span className="link-chip link-chip--muted">
            <LockIcon width={15} height={15} /> {p.private}
          </span>
        )}
      </div>
    </article>
  );
}

export function CtaBanner() {
  const { u } = useSite();
  return (
    <section className="container">
      <div className="cta-banner reveal">
        <div>
          <h2>{u.ctaTitle}</h2>
          <p>{u.ctaText}</p>
        </div>
        <Link to="/contact" className="btn btn--primary">
          {u.ctaButton} <ArrowIcon width={16} height={16} />
        </Link>
      </div>
    </section>
  );
}
