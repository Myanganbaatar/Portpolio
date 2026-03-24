import './Skills.css';

export default function Skills() {
  const skills = {
    'Langages de programmation': ['Java', 'JavaScript', 'Python', 'Rust', 'PHP', 'C/C++', 'Kotlin', 'C#'],
    'Web & Mobile': ['HTML/CSS', 'React', '.NET MAUI', 'Node.js', 'JavaFX'],
    'DevOps & Outils': ['GitLab', 'Docker', 'Virtualisation', 'Git', 'VS Code'],
    'Bases de Données': ['MySQL', 'PostgreSQL', 'SQL', 'MongoDB', 'WAMP'],
    'Systèmes & Domaines': ['Systèmes d\'Information (SI)', 'Réseaux', 'Cryptographie', 'UML']
  };

  return (
    <section className="skills" id="skills">
      <h2>Compétences & Technologies</h2>
      <div className="skills-container">
        {Object.keys(skills).map(category => (
          <div key={category} className="skill-category">
            <h3>{category}</h3>
            <div className="skills-list">
              {skills[category].map((skill, idx) => (
                <div key={idx} className="skill-item">
                  <strong>{skill}</strong>
                  <span className="level">Maîtrisé</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
