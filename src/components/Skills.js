import './Skills.css';

export default function Skills() {
  const skills = {
    Frontend: ['React', 'JavaScript', 'HTML/CSS', 'Tailwind', 'Responsive Design'],
    Backend: ['Node.js', 'Express', 'MongoDB', 'SQL', 'REST APIs'],
    Other: ['Git', 'Docker', 'AWS', 'Figma', 'Problem Solving']
  };

  return (
    <section className="skills">
      <h2>Skills & Technologies</h2>
      <div className="skills-container">
        {Object.keys(skills).map(category => (
          <div key={category} className="skill-category">
            <h3>{category}</h3>
            <div className="skills-list">
              {skills[category].map((skill, idx) => (
                <div key={idx} className="skill-item">
                  <strong>{skill}</strong>
                  <span className="level">Proficient</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
