import './Projects.css';
import LaticeGame from './LaticeGame';
import PythonGames from './PythonGames';
import { useState } from 'react';

export default function Projects() {
  const [showLaticeGame, setShowLaticeGame] = useState(false);
  const [showPythonGames, setShowPythonGames] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 1,
      title: 'Jeu Latice - SAE Java',
      description: 'Jeu de plateau complet développé en Java/JavaFX. Role de développeur principal et coordinateur d\'équipe (4 personnes).',
      details: 'Ce projet a consisté en la réalisation du jeu de plateau "Latice" en Java. Nous avons utilisé JavaFX pour l\'interface graphique et suivi une architecture MVC. Mes missions principales incluaient la conception du moteur de jeu (gestion des tuiles, règles de placement, calcul des points), la coordination de l\'équipe via Git/GitLab, et l\'implémentation d\'un adversaire virtuel simple pour le mode solo.',
      tags: ['Java', 'JavaFX', 'CSS', 'Scene Builder', 'Git'],
      icon: '🎮',
      link: 'https://github.com/Myanganbaatar'
    },
    {
      id: 2,
      title: 'Mini-Jeux - SAE Python',
      description: 'Suite complète de 4 jeux développée en Python: Devinette, Allumettes, Morpion (3x3), et Puissance 4 (6x7).',
      details: 'Développement d\'une suite de mini-jeux classiques en Python. L\'objectif était de concevoir une architecture modulaire permettant d\'ajouter facilement de nouveaux jeux. Chaque jeu propose un mode Joueur contre Joueur et un mode Joueur contre Ordinateur (algorithmes Minimax pour les jeux à information parfaite).',
      tags: ['Python', 'Algorithmique', 'Jeux'],
      icon: '🎮',
      link: 'https://github.com/Myanganbaatar/SAE-PYTHON'
    },
    {
      id: 3,
      title: 'Questionary - Plateforme de Questionnaires',
      description: 'Plateforme web complète pour créer et analyser des questionnaires. Architecture MVC avec PHP/MariaDB et Vue.js.',
      details: 'Développement d\'une application Web dynamique permettant aux enseignants de créer des questionnaires et aux étudiants d\'y répondre. Le backend en PHP (MVC sans framework) interagit avec une base de données MariaDB. Le frontend utilise Vue.js pour la réactivité. Travail focalisé sur la gestion des sessions, la sécurité (injections SQL, XSS) et la visualisation des résultats avec Chart.js.',
      tags: ['PHP', 'MariaDB', 'Vue.js', 'Chart.js', 'REST API'],
      icon: '📋',
      link: 'https://github.com/Mdeterne/php-mariadb-Questionary'
    },
    {
      id: 4,
      title: 'Clone Netflix - Architecture Web',
      description: 'Projet de cours "Complément Web". Clone de Netflix incluant l\'authentification et le filtrage.',
      details: 'Réalisation d\'une interface moderne et responsive imitant Netflix. Utilisation de l\'API TMDB pour récupérer les données de films en temps réel.',
      tags: ['JavaScript', 'CSS', 'Node.js', 'Frontend/Backend'],
      icon: '🎬',
      link: 'https://github.com/Myanganbaatar/Netflix'
    },
    {
      id: 5,
      title: 'Gestionnaire de Tâches - Mobile',
      description: 'Application mobile native Android développée en Kotlin.',
      details: 'Application Android native respectant les guidelines Material Design. Utilisation de Room Database pour la persistance des données locale et des Coroutines pour la gestion asynchrone.',
      tags: ['Kotlin', 'Android', 'Mobile', 'Gradle'],
      icon: '📱',
      link: 'https://github.com/Myanganbaatar/Projet-Kotlin'
    },
    {
      id: 6,
      title: 'Application .NET MAUI (En cours)',
      description: 'Projet actuel de développement mobile multiplateforme utilisant le framework .NET MAUI.',
      details: 'Exploration du framework .NET MAUI pour créer une application unique fonctionnant sur Android et Windows. Focus sur le pattern MVVM et le XAML.',
      tags: ['C#', '.NET MAUI', 'Mobile', 'Multiplateforme'],
      icon: '🚧',
      link: 'https://github.com/Myanganbaatar/ProjetMAUI'
    },
    {
      id: 7,
      title: 'Conception Base de Données (SAE 1.04) ',
      description: 'Conception intégrale d\'une base de données relationnelle. Du Dictionnaire de Données au SQL.',
      details: `Projet de conception et d'implémentation d'une base de données pour la gestion d'événements culturels (concerts, théâtres).
      
      Étapes réalisées :
      1. Analyse des besoins et recensement des données (Dictionnaire de Données).
      2. Modélisation Conceptuelle (MCD) avec Merise : identification des entités (Artistes, Lieux, Événements) et associations.
      3. Passage au Modèle Logique (MLD) et normalisation (3NF).
      4. Implémentation SQL : Scripts de création de tables (DDL) et insertion de jeux de données (DML).
      5. Exploitation : Rédaction de requêtes complexes (jointures, agrégations) pour extraire des statistiques.`,
      tags: ['SQL', 'Merise', 'Modélisation', 'SGBD'],
      icon: '🗄️',
      link: null
    },
    {
      id: 8,
      title: 'Algorithmique & Structures (SAE 1.03) ',
      description: 'Introduction approfondie aux structures de données. Optimisation et analyse de complexité.',
      details: `Étude comparative et implémentation d'algorithmes de tri et de recherche.
      
      Travail effectué :
      - Analyse de la complexité temporelle et spatiale (O notation).
      - Comparaison de structures de données (Tableaux vs Listes chaînées vs Arbres).
      - Implémentation en Python/C d'algorithmes optimisés pour traiter de grands volumes de données.
      - Rédaction d'un rapport d'analyse justifiant les choix techniques en fonction des performances mesurées.`,
      tags: ['Algorithmique', 'Logique', 'Optimisation', 'Structures de données'],
      icon: '🧠',
      link: null
    },
    {
      id: 9,
      title: 'Gestion de Projet (SAE 2.05) ',
      description: 'Pilotage d\'équipe et planification de projet. Gestion des délais et de la communication.',
      details: `Gestion complète d'un projet informatique en équipe, axé sur l'organisation et la méthodologie.
      
      Points clés du rapport :
      - Initialisation : Définition du périmètre, des objectifs et des livrables.
      - Planification : Création et suivi d'un diagramme de Gantt, allocation des ressources.
      - Méthodologie : Application de méthodes agiles (Daily meetings, Sprints).
      - Communication : Rédaction de comptes-rendus de réunion et d'une documentation technique claire.
      - Bilan : Analyse post-mortem des écarts entre le prévisionnel et le réel.`,
      tags: ['Gestion de Projet', 'Agile', 'Communication', 'Documentation'],
      icon: '📈',
      link: null
    }
  ];

  const handleProjectClick = (project) => {
      setSelectedProject(project);
  };

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
              <button 
                className="project-link" 
                onClick={(e) => {
                    e.preventDefault();
                    if (project.link && !project.details) {
                        window.open(project.link, '_blank');
                    } else {
                        handleProjectClick(project);
                    }
                }}
              >
                {project.details || !project.link ? 'Voir les détails +' : 'Voir le projet →'}
              </button>
            </div>
          </div>
        ))}
      </div>

       {/* Project Detail Modal */}
       {selectedProject && (
        <div className="project-modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="project-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setSelectedProject(null)}>×</button>
            <div className="modal-header">
                <div className="modal-icon">{selectedProject.icon}</div>
                <h3>{selectedProject.title}</h3>
            </div>
            <div className="modal-content">
                <p className="modal-description">{selectedProject.details || selectedProject.description}</p>
                
                {selectedProject.link && (
                    <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="modal-link-btn">
                        Accéder au dépôt / site 🔗
                    </a>
                )}
                
                <div className="modal-tags">
                    {selectedProject.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
