import { useSite, usePageTitle } from '../context';
import { ExternalIcon } from '../components/Icons';
import { CtaBanner, PageHeader, TagList } from '../components/ui';
import { Stagger, staggerItem } from '../components/motion';
import { motion } from 'framer-motion';
import './pages.css';

export default function Experience() {
  const { t } = useSite();
  const x = t.experience;
  usePageTitle(x.title);

  return (
    <>
      <PageHeader eyebrow={t.nav.experience} title={x.title} lead={x.intro} robot="type" />
      <Stagger className="container bento bento--page">
        <motion.header className="tile b-c4 xp-head-tile" variants={staggerItem}>
          <div className="tile__xp">
            <div className="xp-teaser__logo" aria-hidden="true">
              IT
            </div>
            <div>
              <h2 className="tile__title">{x.role}</h2>
              <p className="xp-teaser__meta">
                {x.company} · {x.place}
              </p>
            </div>
          </div>
          <span className="date-chip">{x.date}</span>
        </motion.header>

        {x.items.map((item, i) => (
          <motion.section key={item.name} className={`tile ${i === x.items.length - 1 && x.items.length % 2 ? 'b-c4' : 'b-c2'} xp-tile`} variants={staggerItem}>
            <span className="tile__label">
              0{i + 1} · {x.company}
            </span>
            <div>
              <h3 className="tile__title tile__title--sm">
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
            </div>
            <TagList items={item.tech} />
          </motion.section>
        ))}

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
