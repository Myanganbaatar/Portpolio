import { useState } from 'react';
import { useSite, usePageTitle } from '../context';
import { links } from '../content';
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon, PhoneIcon, PinIcon } from '../components/Icons';
import { PageHeader } from '../components/ui';
import { Stagger, staggerItem } from '../components/motion';
import { motion } from 'framer-motion';
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
      <Stagger className="container bento bento--page">
        <motion.div className="tile b-c2 b-r2 contact-main" variants={staggerItem}>
          <span className="contact-main__icon" aria-hidden="true">
            <MailIcon width={26} height={26} />
          </span>
          <div>
            <p className="eyebrow">Email</p>
            <a href={`mailto:${links.email}`} className="contact-main__email">
              {links.email}
            </a>
          </div>
          <div className="contact-main__actions">
            <a href={`mailto:${links.email}`} className="btn btn--primary">
              <MailIcon width={16} height={16} /> {lang === 'fr' ? 'Écrire un e-mail' : 'Send an email'}
            </a>
            <button className="btn" onClick={copyEmail}>
              {copied ? u.copied : u.copy}
            </button>
          </div>
        </motion.div>

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
            <motion.a key={ch.label} variants={staggerItem} href={ch.href} className="tile contact-tile" {...(ch.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
              {inner}
            </motion.a>
          ) : (
            <motion.div key={ch.label} variants={staggerItem} className="tile contact-tile">
              {inner}
            </motion.div>
          );
        })}

        <motion.a variants={staggerItem} className="tile b-c2 cv-tile" href={`${process.env.PUBLIC_URL}/cv/CV_Barsbold_Myanganbaatar_stage_fr.pdf`} download>
          <span className="tile__label">CV · PDF</span>
          <span className="tile__title tile__title--sm">
            <DownloadIcon /> {c.cvFr}
          </span>
        </motion.a>
        <motion.a variants={staggerItem} className="tile b-c2 cv-tile" href={`${process.env.PUBLIC_URL}/cv/CV_Barsbold_Myanganbaatar_stage_en.pdf`} download>
          <span className="tile__label">CV · PDF</span>
          <span className="tile__title tile__title--sm">
            <DownloadIcon /> {c.cvEn}
          </span>
        </motion.a>
      </Stagger>
    </>
  );
}
