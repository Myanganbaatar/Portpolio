import { Link } from 'react-router-dom';
import { useSite, usePageTitle } from '../context';
import { ArrowIcon } from '../components/Icons';
import { CtaBanner, PageHeader } from '../components/ui';
import { Stagger, staggerItem } from '../components/motion';
import { motion } from 'framer-motion';
import './pages.css';

export default function About() {
  const { t, u } = useSite();
  const a = t.about;
  usePageTitle(a.title);

  return (
    <>
      <PageHeader eyebrow={t.nav.about} title={a.title} lead={t.hero.role} robot="globe" />
      <Stagger className="container bento bento--page">
        <motion.div className="tile b-c3 b-r2 about__text" variants={staggerItem}>
          <span className="tile__label">{a.title}</span>
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
        </motion.div>
        <motion.aside className="tile b-r2 facts" variants={staggerItem}>
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
        </motion.aside>
        {t.education.items.map((e) => (
          <motion.div key={e.name} className="tile b-c4 edu-tile" variants={staggerItem}>
            <span className="tile__label">🎓 {t.education.title}</span>
            <div>
              <h3 className="tile__title tile__title--sm">{e.name}</h3>
              <p className="tile__muted">{e.school}</p>
              <p className="edu-card__note">{e.note}</p>
            </div>
            <span className="date-chip">{e.date}</span>
          </motion.div>
        ))}
      </Stagger>

      <CtaBanner />
    </>
  );
}
