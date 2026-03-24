import './Contact.css';

export default function Contact() {
  return (
    <section className="contact">
      <h2>Let's Work Together</h2>
      <p>I'm always interested in hearing about new projects and opportunities.</p>
      <div className="contact-links">
        <a href="mailto:your.email@example.com" className="contact-link">Email Me</a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="contact-link">GitHub</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="contact-link">LinkedIn</a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="contact-link">Twitter</a>
      </div>
      <div className="footer">
        <p>&copy; 2026 Your Name. All rights reserved.</p>
      </div>
    </section>
  );
}
