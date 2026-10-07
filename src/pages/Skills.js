import { useSite, usePageTitle } from '../context';
import { motion } from 'framer-motion';
import { CtaBanner, PageHeader } from '../components/ui';
import { Stagger, TiltCard } from '../components/motion';
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
      <PageHeader eyebrow={t.nav.skills} title={t.skills.title} lead={lead} robot="juggle" />
      <Stagger className="container skills-grid">
        {t.skills.groups.map((g, i) => (
          <TiltCard key={g.name} max={4} className={`card skill-group ${i === 0 ? 'skill-group--wide' : ''}`}>
            <h2 className="skill-group__title">
              <span aria-hidden="true">{ICONS[i]}</span> {g.name}
            </h2>
            <ul className="skill-list">
              {g.items.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </TiltCard>
        ))}
        <TiltCard max={4} className="card skill-group">
          <h2 className="skill-group__title">
            <span aria-hidden="true">🌍</span> {lang === 'fr' ? 'Langues' : 'Languages'}
          </h2>
          <ul className="lang-bars">
            {(lang === 'fr'
              ? [['Mongol', 'Langue maternelle', 100], ['Français', 'Intermédiaire', 60], ['Anglais', 'Intermédiaire', 60]]
              : [['Mongolian', 'Native', 100], ['French', 'Intermediate', 60], ['English', 'Intermediate', 60]]
            ).map(([name, level, pct]) => (
              <li key={name}>
                <div className="lang-bars__row">
                  <span>{name}</span>
                  <span className="lang-bars__level">{level}</span>
                </div>
                <div className="lang-bars__track">
                  <motion.span
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </TiltCard>
      </Stagger>
      <CtaBanner />
    </>
  );
}
