import { Link } from 'react-router-dom';
import { useSite, usePageTitle } from '../context';
import { links, projects } from '../content';
import { ArrowIcon, DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from '../components/Icons';
import { CtaBanner, ProjectCard, RobotSlot, SectionTitle } from '../components/ui';
import { CountUp, Reveal, Stagger, TiltCard } from '../components/motion';
import './pages.css';

const FEATURED = ['cms', 'python', 'latice'];

function CodeCard({ lang }) {
  const fr = lang === 'fr';
  return (
    <div className="code-card reveal reveal-3" aria-hidden="true">
      <div className="code-card__bar">
        <span />
        <span />
        <span />
        <em>barsbold.js</em>
      </div>
      <pre className="code-card__body">
        <code>
          <span className="c-kw">const</span> <span className="c-var">barsbold</span> = {'{'}
          {'\n'}  <span className="c-key">role</span>: <span className="c-str">"{fr ? 'Développeur full-stack' : 'Full-stack developer'}"</span>,
          {'\n'}  <span className="c-key">based</span>: <span className="c-str">"Limoges, France"</span>,
          {'\n'}  <span className="c-key">stack</span>: [<span className="c-str">"JavaScript"</span>, <span className="c-str">"React"</span>,
          {'\n'}          <span className="c-str">"Next.js"</span>, <span className="c-str">"Node.js"</span>, <span className="c-str">"PostgreSQL"</span>],
          {'\n'}  <span className="c-key">shippedToProd</span>: <span className="c-num">3</span>,
          {'\n'}  <span className="c-key">speaks</span>: [<span className="c-str">"mn"</span>, <span className="c-str">"fr"</span>, <span className="c-str">"en"</span>],
          {'\n'}  <span className="c-key">availableFrom</span>: <span className="c-str">"2027-03"</span>,
          {'\n'}{'}'};
        </code>
      </pre>
    </div>
  );
}

export default function Home() {
  const { t, u, lang } = useSite();
  usePageTitle(null);
  const h = t.hero;

  return (
    <>
      <section className="hero">
        <div className="hero__bg" aria-hidden="true" />
        <div className="container hero__grid">
          <div>
            <p className="status-pill reveal">
              <span className="status-dot" /> {h.status}
            </p>
            <h1 className="hero__title reveal reveal-2">
              <span className="hero__hello">{h.hello}</span>
              Barsbold <span className="gradient-text">Myanganbaatar</span>
            </h1>
            <p className="hero__role reveal reveal-2">{h.role}</p>
            <p className="hero__pitch reveal reveal-3">{h.pitch}</p>
            <div className="hero__actions reveal reveal-3">
              <Link to="/projects" className="btn btn--primary">
                {h.cta} <ArrowIcon width={16} height={16} />
              </Link>
              <a href={h.cvHref} className="btn" download>
                <DownloadIcon width={16} height={16} /> {h.cv}
              </a>
            </div>
            <div className="hero__social reveal reveal-3">
              <a className="icon-btn" href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <GitHubIcon />
              </a>
              <a className="icon-btn" href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
              <a className="icon-btn" href={`mailto:${links.email}`} aria-label="Email">
                <MailIcon />
              </a>
            </div>
          </div>
          <div className="hero-3d">
            <RobotSlot mode="hello" className="robot-slot--hero" />
            <CodeCard lang={lang} />
          </div>
        </div>

        <div className="container">
          <dl className="stats reveal reveal-3">
            {h.stats.map((s) => (
              <div key={s.label} className="stat">
                <dt>
                  <CountUp value={s.value} />
                </dt>
                <dd>{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section container">
        <Reveal>
          <SectionTitle eyebrow="01" title={u.whatIDo} />
        </Reveal>
        <Stagger className="grid grid--3">
          {u.services.map((s) => (
            <TiltCard key={s.title} className="card service-card">
              <span className="service-card__icon" aria-hidden="true">
                {s.icon}
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </TiltCard>
          ))}
        </Stagger>
      </section>

      <section className="section container">
        <Reveal>
          <SectionTitle
            eyebrow="02"
            title={u.featured}
            action={
              <Link to="/projects" className="text-link">
                {u.allProjects} <ArrowIcon width={16} height={16} />
              </Link>
            }
          />
        </Reveal>
        <Stagger className="grid grid--3">
          {FEATURED.map((id) => (
            <ProjectCard key={id} project={projects.find((p) => p.id === id)} />
          ))}
        </Stagger>
      </section>

      <section className="section container">
        <Reveal>
          <SectionTitle
            eyebrow="03"
            title={t.experience.title}
            action={
              <Link to="/experience" className="text-link">
                {u.seeExperience} <ArrowIcon width={16} height={16} />
              </Link>
            }
          />
        </Reveal>
        <Reveal delay={0.1}>
          <Link to="/experience" className="card xp-teaser">
            <div className="xp-teaser__logo" aria-hidden="true">
              IT
            </div>
            <div>
              <h3>{t.experience.role}</h3>
              <p className="xp-teaser__meta">
                {t.experience.company} · {t.experience.place} · {t.experience.date}
              </p>
              <p className="xp-teaser__text">{t.experience.intro}</p>
            </div>
            <ArrowIcon className="xp-teaser__arrow" />
          </Link>
        </Reveal>
      </section>

      <Reveal>
        <CtaBanner />
      </Reveal>
    </>
  );
}
