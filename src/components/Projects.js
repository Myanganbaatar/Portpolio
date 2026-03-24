import './Projects.css';
import LaticeGame from './LaticeGame';
import PythonGames from './PythonGames';
import { useState } from 'react';

export default function Projects() {
  const [showLaticeGame, setShowLaticeGame] = useState(false);
  const [showPythonGames, setShowPythonGames] = useState(false);
  const projects = [
    {
      id: 1,
      title: 'Jeu Latice - SAE Java',
      description: 'Jeu de plateau complet développé en Java/JavaFX. Role de développeur principal et coordinateur d\'équipe (4 personnes) pendant 10 semaines. Responsable de 7 versions de l\'interface JavaFX et 5 du moteur Java.',
      tags: ['Java', 'JavaFX', 'CSS', 'Scene Builder'],
      icon: '🎮',
      link: 'https://github.com/Myanganbaatar'
    },
    {
      id: 2,
      title: 'Mini-Jeux - SAE Python',
      description: 'Suite complète de 4 jeux développée en Python: Devinette, Allumettes, Morpion (3x3), et Puissance 4 (6x7). Modes de jeu: Humain vs Humain ou Contre le Robot. Système de scores persistant.',
      tags: ['Python', 'Jeux'],
      icon: '🎮',
      link: 'https://github.com/Myanganbaatar/SAE-PYTHON'
    },
    {
      id: 3,
      title: 'Questionary - Plateforme de Questionnaires',
      description: 'Plateforme web complète pour créer et analyser des questionnaires. Architecture MVC avec PHP/MariaDB et Vue.js. Fonctionnalités: créateur dynamique de formulaires (5 types de questions), dashboard enseignant, interface étudiante, analyse des résultats avec graphiques (Chart.js), export PDF/CSV/XLSX, codes PIN, QR codes, logique conditionnelle.',
      tags: ['PHP', 'MariaDB', 'Vue.js', 'Chart.js', 'REST API'],
      icon: '📋',
      link: 'https://github.com/Mdeterne/php-mariadb-Questionary'
    },
    {
      id: 4,
      title: 'Clone Netflix - Architecture Web',
      description: 'Projet de cours "Complément Web". Développement d\'une application web suivant une architecture moderne. Clone de Netflix incluant l\'authentification, la gestion du panier, la recherche de films et le filtrage par genre.',
      tags: ['JavaScript', 'CSS', 'Node.js', 'Frontend/Backend'],
      icon: '🎬',
      link: 'https://github.com/Myanganbaatar/Netflix'
    },
    {
      id: 5,
      title: 'Gestionnaire de Tâches - Mobile',
      description: 'Application mobile native Android développée en Kotlin. Fonctionnalités complètes de gestion de tâches: ajout, modification avec filtrage et recherche. Projet finalisé démontrant la maîtrise du développement mobile natif.',
      tags: ['Kotlin', 'Android', 'Mobile', 'Gradle'],
      icon: '📱',
      link: 'https://github.com/Myanganbaatar/Projet-Kotlin'
    },
    {
      id: 6,
      title: 'Application .NET MAUI (En cours)',
      description: 'Projet actuel de développement mobile multiplateforme utilisant le framework .NET MAUI et le langage C#. Exploration des architectures cross-platform modernes.',
      tags: ['C#', '.NET MAUI', 'Mobile', 'Multiplateforme'],
      icon: '🚧',
      link: 'https://github.com/Myanganbaatar/ProjetMAUI'
    },
    {
      id: 7,
      title: 'Conception Base de Données (SAE 1.04) 🆕',
      description: 'Conception intégrale d\'une base de données relationnelle. Réalisation du Dictionnaire de Données, du Schéma Entité-Association (MCD) et implémentation des scripts SQL (Création, Peuplement, Requêtes complexes).',
      tags: ['SQL', 'Merise', 'Modélisation', 'SGBD'],
      icon: '🗄️',
      link: '#'
    },
    {
      id: 8,
      title: 'Algorithmique & Structures (SAE 1.03) 🆕',
      description: 'Introduction approfondie aux structures de données et à l\'algorithmique. Résolution de problèmes complexes, optimisation de code et analyse de complexité. Documentations et rapports d\'analyse.',
      tags: ['Algorithmique', 'Logique', 'Optimisation', 'Structures de données'],
      icon: '🧠',
      link: '#'
    },
    {
      id: 9,
      title: 'Gestion de Projet - Latice (SAE 2.05) 🆕',
      description: 'Pilotage d\'équipe sur le projet Latice. Planification (Gantt), répartition des tâches, suivi de l\'avancement et rédaction de la documentation technique et fonctionnelle. Gestion des délais et de la communication.',
      tags: ['Gestion de Projet', 'Agile', 'Communication', 'Documentation'],
      icon: '📈',
      link: '#'
    }
  ];

  return (
    <section className="projects" id="projects">
      <h2>Projets présentés</h2>
      
      {/* Playable Games Section */}
      <div className="playable-games-section">
        <h3>💻 Démonstration en Version Web</h3>
        {!showLaticeGame && !showPythonGames ? (
          <div className="games-showcase">
            <div className="game-preview-card" onClick={() => setShowLaticeGame(true)}>
              <div className="game-preview-icon">🤖</div>
              <div className="game-preview-info">
                <h4>Jeu Latice - Démonstration du jeu</h4>
                <p>Jouez au jeu Latice! Disponible en mode contre le Robot ou à 2 joueurs (Local). Placez vos tuiles et trouvez des correspondances.</p>
                <button className="game-play-btn">Jouer →</button>
              </div>
            </div>
            <div className="game-preview-card" onClick={() => setShowPythonGames(true)}>
              <div className="game-preview-icon">🎮</div>
              <div className="game-preview-info">
                <h4>4 Jeux Python - Version Web</h4>
                <p>Morpion, Puissance 4, Allumettes et Devinette. Jouables contre le Robot ou à 2 joueurs (Local). Développés en Python et portés sur le Web.</p>
                <button className="game-play-btn">Jouer →</button>
              </div>
            </div>
          </div>
        ) : showLaticeGame ? (
          <div className="game-player-container">
            <button className="game-back-btn" onClick={() => setShowLaticeGame(false)}>← Retour</button>
            <LaticeGame />
          </div>
        ) : (
          <div className="game-player-container">
            <button className="game-back-btn" onClick={() => setShowPythonGames(false)}>← Retour</button>
            <PythonGames />
          </div>
        )}
      </div>

      {/* Projects Grid */}
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
              <a href={project.link} className="project-link">Voir le projet →</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
