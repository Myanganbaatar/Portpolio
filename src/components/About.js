import './About.css';

export default function About() {
  return (
    <section className="about" id="about">
      <div className="about-container">
        <div>
          <h2>À propos</h2>
          <p>
            Étudiant actuellement en 2ème année de BUT Informatique à l'IUT de Limoges, je suis passionné par la programmation et le développement web. J'ai acquis une solide expérience en Java, Python, et technologies web à travers plusieurs projets académiques.
          </p>
          <p>
            Dynamique et autonome, je maîtrise le travail en équipe et la gestion de projet. Je suis curieux, toujours en quête d'apprentissage de nouvelles technologies, et j'aime résoudre des problèmes complexes de manière créative.
          </p>
          
        </div>
        <div className="about-image-container">
          {/* Illustration de codage */}
          <img 
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Développeur en train de coder" 
            className="about-image" 
          />
        </div>
      </div>
    </section>
  );
}
