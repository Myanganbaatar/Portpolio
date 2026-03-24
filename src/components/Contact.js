import './Contact.css';

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <h2>Travaillons ensemble!</h2>
      <p>Je suis à la recherche d'un stage en informatique. N'hésitez pas à me contacter!</p>
      
      <div className="contact-details">
        <a href="mailto:1000barsaa@gmail.com" className="detail-item">
          📧 1000barsaa@gmail.com
        </a>
        <a href="tel:+33652193415" className="detail-item">
          📱 06 52 19 34 15
        </a>
      </div>

      <div className="contact-links">
        <a href="https://github.com/Myanganbaatar" target="_blank" rel="noopener noreferrer" className="contact-link">
          GitHub
        </a>
        <a href="https://www.linkedin.com/in/barsboldmyanganbaatar-a79557386" target="_blank" rel="noopener noreferrer" className="contact-link">
          LinkedIn
        </a>
      </div>
      <div className="footer">
        <p>&copy; 2026 Barsbold Myanganbaatar. Tous droits réservés.</p>
      </div>
    </section>
  );
}
