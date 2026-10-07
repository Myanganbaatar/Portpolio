import { useState } from 'react';
import { useSite, usePageTitle } from '../context';
import { links } from '../content';
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon, PhoneIcon, PinIcon } from '../components/Icons';
import { PageHeader } from '../components/ui';
import './pages.css';

export default function Contact() {
  const { t, u, lang } = useSite();
  const c = t.contact;
  const [copied, setCopied] = useState(false);
  usePageTitle(c.title);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${links.email}`;
    }
  };

  const channels = [
    { icon: <PhoneIcon />, label: lang === 'fr' ? 'Téléphone' : 'Phone', value: links.phone, href: links.phoneHref },
    { icon: <LinkedInIcon />, label: 'LinkedIn', value: 'barsbold-myanganbaatar', href: links.linkedin, external: true },
    { icon: <GitHubIcon />, label: 'GitHub', value: 'Myanganbaatar', href: links.github, external: true },
    { icon: <PinIcon />, label: lang === 'fr' ? 'Localisation' : 'Location', value: 'Limoges, France' },
  ];

  return (
    <>
      <PageHeader eyebrow={t.nav.contact} title={c.title} lead={c.text} robot="mail" />
      <section className="container contact reveal reveal-2">
        <div className="card contact-main">
          <span className="contact-main__icon" aria-hidden="true">
            <MailIcon width={26} height={26} />
          </span>
          <p className="eyebrow">Email</p>
          <a href={`mailto:${links.email}`} className="contact-main__email">
            {links.email}
          </a>
          <div className="contact-main__actions">
            <a href={`mailto:${links.email}`} className="btn btn--primary">
              <MailIcon width={16} height={16} /> {lang === 'fr' ? 'Écrire un e-mail' : 'Send an email'}
            </a>
            <button className="btn" onClick={copyEmail}>
              {copied ? u.copied : u.copy}
            </button>
          </div>
        </div>

        <div className="contact-list">
          {channels.map((ch) => {
            const inner = (
              <>
                <span className="contact-item__icon" aria-hidden="true">
                  {ch.icon}
                </span>
                <span>
                  <span className="contact-item__label">{ch.label}</span>
                  <span className="contact-item__value">{ch.value}</span>
                </span>
              </>
            );
            return ch.href ? (
              <a key={ch.label} href={ch.href} className="card contact-item" {...(ch.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
                {inner}
              </a>
            ) : (
              <div key={ch.label} className="card contact-item">
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      <section className="section container">
        <h2 className="sub-title">CV</h2>
        <div className="cv-row">
          <a className="card cv-card" href={`${process.env.PUBLIC_URL}/cv/CV_Barsbold_Myanganbaatar_stage_fr.pdf`} download>
            <DownloadIcon /> <span>{c.cvFr}</span> <em>PDF</em>
          </a>
          <a className="card cv-card" href={`${process.env.PUBLIC_URL}/cv/CV_Barsbold_Myanganbaatar_stage_en.pdf`} download>
            <DownloadIcon /> <span>{c.cvEn}</span> <em>PDF</em>
          </a>
        </div>
      </section>
    </>
  );
}
