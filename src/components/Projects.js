import './Projects.css';

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce app with React frontend and Node.js backend',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      icon: '🛍️',
      link: '#'
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Collaborative task management with real-time updates',
      tags: ['React', 'Firebase', 'Tailwind'],
      icon: '✓',
      link: '#'
    },
    {
      id: 3,
      title: 'AI Chat Bot',
      description: 'Intelligent chatbot using machine learning and NLP',
      tags: ['Python', 'TensorFlow', 'API'],
      icon: '💬',
      link: '#'
    }
  ];

  return (
    <section className="projects" id="projects">
      <h2>Featured Projects</h2>
      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <div className="project-image">{project.icon}</div>
            <div className="project-info">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag, idx) => (
                  <span key={idx} className="tag">{tag}</span>
                ))}
              </div>
              <a href={project.link} className="project-link">View Project →</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
