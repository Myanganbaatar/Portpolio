import { useSite, usePageTitle } from '../context';
import { CtaBanner, PageHeader } from '../components/ui';
import './pages.css';

const ICONS = ['⌨️', '🎨', '🛠️', '📦', '🤝'];

export default function Skills() {
  const { t, lang } = useSite();
  usePageTitle(t.skills.title);
  const lead =
    lang === 'fr'
      ? 'Les langages, frameworks et outils que j’utilise au quotidien, du navigateur jusqu’au serveur.'
      : 'The languages, frameworks and tools I use every day, from the browser to the server.';

  return (
    <>
      <PageHeader eyebrow={t.nav.skills} title={t.skills.title} lead={lead} />
      <section className="container skills-grid reveal reveal-2">
        {t.skills.groups.map((g, i) => (
          <div key={g.name} className={`card skill-group ${i === 0 ? 'skill-group--wide' : ''}`}>
            <h2 className="skill-group__title">
              <span aria-hidden="true">{ICONS[i]}</span> {g.name}
            </h2>
            <ul className="skill-list">
              {g.items.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        ))}
        <div className="card skill-group">
          <h2 className="skill-group__title">
            <span aria-hidden="true">🌍</span> {lang === 'fr' ? 'Langues' : 'Languages'}
          </h2>
          <ul className="lang-bars">
            {(lang === 'fr'
              ? [['Mongol', 'Langue maternelle', 100], ['Français', 'Courant', 85], ['Anglais', 'Courant', 80]]
              : [['Mongolian', 'Native', 100], ['French', 'Fluent', 85], ['English', 'Fluent', 80]]
            ).map(([name, level, pct]) => (
              <li key={name}>
                <div className="lang-bars__row">
                  <span>{name}</span>
                  <span className="lang-bars__level">{level}</span>
                </div>
                <div className="lang-bars__track">
                  <span style={{ width: `${pct}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
