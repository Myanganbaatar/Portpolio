import { Link } from 'react-router-dom';
import { useSite, usePageTitle } from '../context';
import { ArrowIcon } from '../components/Icons';
import { CtaBanner, PageHeader } from '../components/ui';
import './pages.css';

export default function About() {
  const { t, u } = useSite();
  const a = t.about;
  usePageTitle(a.title);

  return (
    <>
      <PageHeader eyebrow={t.nav.about} title={a.title} lead={t.hero.role} />
      <section className="container about">
        <div className="about__text reveal reveal-2">
          {a.paragraphs.map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
          <div className="about__links">
            <Link to="/experience" className="btn">
              {u.seeExperience} <ArrowIcon width={16} height={16} />
            </Link>
            <Link to="/projects" className="btn">
              {u.allProjects} <ArrowIcon width={16} height={16} />
            </Link>
          </div>
        </div>
        <aside className="card facts reveal reveal-3">
          <div className="facts__avatar" aria-hidden="true">
            BM
          </div>
          <dl>
            {a.facts.map((f) => (
              <div key={f.label} className="facts__row">
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </section>

      <section className="section container">
        <h2 className="sub-title">{t.education.title}</h2>
        {t.education.items.map((e) => (
          <div key={e.name} className="card edu-card">
            <div className="edu-card__icon" aria-hidden="true">
              🎓
            </div>
            <div className="edu-card__body">
              <h3>{e.name}</h3>
              <p>{e.school}</p>
              <p className="edu-card__note">{e.note}</p>
            </div>
            <span className="date-chip">{e.date}</span>
          </div>
        ))}
      </section>

      <CtaBanner />
    </>
  );
}
