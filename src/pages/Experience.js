import { useSite, usePageTitle } from '../context';
import { ExternalIcon } from '../components/Icons';
import { CtaBanner, PageHeader, TagList } from '../components/ui';
import './pages.css';

export default function Experience() {
  const { t } = useSite();
  const x = t.experience;
  usePageTitle(x.title);

  return (
    <>
      <PageHeader eyebrow={t.nav.experience} title={x.title} lead={x.intro} robot="type" />
      <section className="container timeline">
        <article className="timeline__item reveal reveal-2">
          <div className="timeline__dot" aria-hidden="true" />
          <div className="card xp-card">
            <header className="xp-card__head">
              <div className="xp-teaser__logo" aria-hidden="true">
                IT
              </div>
              <div>
                <h2>{x.role}</h2>
                <p className="xp-teaser__meta">
                  {x.company} · {x.place}
                </p>
              </div>
              <span className="date-chip">{x.date}</span>
            </header>

            <div className="xp-card__projects">
              {x.items.map((item, i) => (
                <section key={item.name} className="xp-project">
                  <div className="xp-project__index">0{i + 1}</div>
                  <div>
                    <h3>
                      {item.name}
                      {item.link && (
                        <a href={item.link.href} target="_blank" rel="noreferrer" className="link-chip link-chip--accent">
                          <ExternalIcon width={14} height={14} /> {item.link.label}
                        </a>
                      )}
                    </h3>
                    <ul className="check-list">
                      {item.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                    <TagList items={item.tech} />
                  </div>
                </section>
              ))}
            </div>
          </div>
        </article>

        <article className="timeline__item reveal reveal-3">
          <div className="timeline__dot timeline__dot--muted" aria-hidden="true" />
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
        </article>
      </section>
      <CtaBanner />
    </>
  );
}
