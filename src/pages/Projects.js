import { useSearchParams } from 'react-router-dom';
import { useSite, usePageTitle } from '../context';
import { projects } from '../content';
import { PageHeader, ProjectCard } from '../components/ui';
import { Stagger } from '../components/motion';
import './pages.css';

const FILTERS = ['all', 'internship', 'university', 'demo'];

export default function Projects() {
  const { t, lang } = useSite();
  const [params, setParams] = useSearchParams();
  const active = FILTERS.includes(params.get('filter')) ? params.get('filter') : 'all';
  usePageTitle(t.projects.title);

  const visible = projects.filter((p) => {
    if (active === 'all') return true;
    if (active === 'demo') return Boolean(p.demo);
    return p.category === active;
  });

  const lead =
    lang === 'fr'
      ? 'Des applications en production réalisées pendant mon stage, et des projets universitaires — dont deux jeux jouables directement ici.'
      : 'Production apps built during my internship, and university projects — including two games you can play right here.';

  return (
    <>
      <PageHeader eyebrow={t.nav.projects} title={t.projects.title} lead={lead} robot="present" />
      <section className="container">
        <div className="filters reveal reveal-2" role="tablist" aria-label="Filter">
          {FILTERS.map((f) => {
            const count = f === 'all' ? projects.length : projects.filter((p) => (f === 'demo' ? p.demo : p.category === f)).length;
            return (
              <button
                key={f}
                role="tab"
                aria-selected={active === f}
                className={`filter ${active === f ? 'is-active' : ''}`}
                onClick={() => setParams(f === 'all' ? {} : { filter: f }, { replace: true })}
              >
                {t.projects.filters[f]} <span className="filter__count">{count}</span>
              </button>
            );
          })}
        </div>
        <Stagger key={active} className="bento bento--projects">
          {visible.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </Stagger>
      </section>
    </>
  );
}
