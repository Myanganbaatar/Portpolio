// All portfolio text lives here, in French and English.
const cv = (lang) => `${process.env.PUBLIC_URL}/cv/CV_Barsbold_Myanganbaatar_stage_${lang}.pdf`;

export const links = {
  email: '1000barsaa@gmail.com',
  phone: '+33 6 52 19 34 15',
  phoneHref: 'tel:+33652193415',
  github: 'https://github.com/Myanganbaatar',
  linkedin: 'https://www.linkedin.com/in/barsbold-myanganbaatar-a79557386/',
};

const techInternship = {
  cms: ['Node.js', 'Express', 'PostgreSQL', 'Next.js', 'Docker', 'Nginx'],
  aupair: ['Next.js 16', 'React 19', 'Tailwind CSS', 'PHP'],
  correct: ['Next.js 14', 'PostgreSQL', 'Docker', 'Nginx'],
};

export const content = {
  fr: {
    nav: { about: 'À propos', experience: 'Expérience', projects: 'Projets', skills: 'Compétences', contact: 'Contact', cv: 'CV' },
    hero: {
      hello: 'Bonjour, je suis',
      role: 'Développeur web full-stack · Étudiant en 3ᵉ année de BUT Informatique',
      status: 'Disponible pour un stage de 16 semaines dès mars 2027',
      pitch: "Je conçois des applications web de bout en bout — de la base de données jusqu'au déploiement en production. Pendant mon stage, j'ai livré trois applications utilisées en conditions réelles.",
      cta: 'Voir mes projets',
      cv: 'Télécharger mon CV',
      cvHref: cv('fr'),
      stats: [
        { value: '3', label: 'applications mises en production' },
        { value: '9', label: 'projets réalisés' },
        { value: '3', label: 'langues parlées' },
      ],
    },
    about: {
      title: 'À propos',
      paragraphs: [
        "Étudiant en 3ᵉ année de BUT Informatique à l'IUT du Limousin (Limoges), j'aime transformer une idée en produit utilisable. Je travaille surtout avec JavaScript, React/Next.js, Node.js et PostgreSQL, et je prends plaisir à m'occuper aussi de la partie déploiement (Docker, Nginx, serveurs Linux).",
        "D'origine mongole, je vis et étudie en France. Autonome, rigoureux et rapide à prendre en main de nouveaux outils, j'apprécie autant travailler en équipe que mener un projet de A à Z.",
      ],
      facts: [
        { label: 'Localisation', value: 'Limoges, France' },
        { label: 'Formation', value: 'BUT Informatique · 2024 – 2027' },
        { label: 'Langues', value: 'Mongol (natif) · Français · Anglais' },
        { label: 'Recherche', value: 'Stage 16 semaines dès mars 2027 · alternance' },
      ],
    },
    experience: {
      title: 'Expérience professionnelle',
      role: 'Stagiaire développeur web full-stack',
      company: 'IT Partner',
      place: 'Oulan-Bator, Mongolie',
      date: 'avr. – juin 2026 · 10 semaines',
      intro: "Conception, développement et mise en production de trois applications web.",
      items: [
        {
          name: 'CMS headless inspiré de Strapi',
          points: [
            'Content-Type Builder générant automatiquement une API REST (14 types de champs, pagination, filtres, brouillon/publication).',
            'Panneau d’administration Next.js : éditeur de contenu en glisser-déposer, médiathèque avec miniatures automatiques, SDK PHP.',
          ],
          tech: techInternship.cms,
        },
        {
          name: 'Site Mongolian Au Pair',
          points: [
            'Site vitrine en production alimenté par le CMS headless : pages programmes dynamiques, FAQ, galerie, témoignages, formulaire de contact.',
            'Version PHP alternative consommant la même API.',
          ],
          tech: techInternship.aupair,
          link: { label: 'mongolian-aupair.com', href: 'https://mongolian-aupair.com' },
        },
        {
          name: 'correctURL — raccourcisseur d’URL',
          points: [
            'Liens courts avec slugs personnalisés, statistiques de clics et gestion du percent-encoding.',
            'Mise en production avec Docker et Nginx sur un serveur Linux.',
          ],
          tech: techInternship.correct,
        },
      ],
    },
    projects: {
      title: 'Projets',
      filters: { all: 'Tous', internship: 'Stage', university: 'IUT', demo: 'Démo jouable' },
      code: 'Code',
      live: 'Site en ligne',
      play: 'Jouer',
      close: 'Fermer',
      private: 'Code privé (entreprise)',
    },
    skills: {
      title: 'Compétences',
      groups: [
        { name: 'Langages', items: ['JavaScript', 'Java', 'PHP', 'Python', 'SQL', 'C#', 'Kotlin', 'C / C++'] },
        { name: 'Front-end', items: ['React', 'Next.js', 'Tailwind CSS', 'HTML / CSS', 'JavaFX'] },
        { name: 'Back-end', items: ['Node.js', 'Express', 'API REST'] },
        { name: 'Données & DevOps', items: ['PostgreSQL', 'MySQL / MariaDB', 'Docker', 'Nginx', 'Linux', 'Git / GitHub'] },
        { name: 'Qualités', items: ['Autonomie', 'Travail en équipe', 'Résolution de problèmes', 'Apprentissage rapide', 'Communication'] },
      ],
    },
    education: {
      title: 'Formation',
      items: [{ name: 'BUT Informatique', school: 'IUT du Limousin, Limoges', date: '2024 – 2027', note: '3ᵉ année en cours' }],
    },
    contact: {
      title: 'Contact',
      text: "Vous cherchez un stagiaire motivé pour mars 2027 ? Écrivez-moi, je vous réponds rapidement.",
      cvFr: 'CV (français)',
      cvEn: 'CV (anglais)',
    },
    footer: 'Conçu et développé par Barsbold Myanganbaatar',
  },

  en: {
    nav: { about: 'About', experience: 'Experience', projects: 'Projects', skills: 'Skills', contact: 'Contact', cv: 'Resume' },
    hero: {
      hello: "Hi, I'm",
      role: 'Full-stack web developer · Third-year Computer Science student',
      status: 'Available for a 16-week internship from March 2027',
      pitch: 'I build web applications end to end — from the database to production deployment. During my internship I shipped three applications that are used in real conditions.',
      cta: 'See my projects',
      cv: 'Download my resume',
      cvHref: cv('en'),
      stats: [
        { value: '3', label: 'apps shipped to production' },
        { value: '9', label: 'projects built' },
        { value: '3', label: 'languages spoken' },
      ],
    },
    about: {
      title: 'About',
      paragraphs: [
        "I'm a third-year Computer Science student (BUT Informatique) at IUT du Limousin in Limoges, France, and I love turning an idea into a usable product. I mostly work with JavaScript, React/Next.js, Node.js and PostgreSQL, and I also enjoy handling deployment (Docker, Nginx, Linux servers).",
        "Originally from Mongolia, I live and study in France. I'm independent, thorough and quick to pick up new tools, and I enjoy both teamwork and owning a project end to end.",
      ],
      facts: [
        { label: 'Location', value: 'Limoges, France' },
        { label: 'Education', value: 'BUT Informatique · 2024 – 2027' },
        { label: 'Languages', value: 'Mongolian (native) · French · English' },
        { label: 'Looking for', value: '16-week internship from March 2027 · work-study' },
      ],
    },
    experience: {
      title: 'Work experience',
      role: 'Full-Stack Web Developer Intern',
      company: 'IT Partner',
      place: 'Ulaanbaatar, Mongolia',
      date: 'Apr – Jun 2026 · 10 weeks',
      intro: 'Designed, built and shipped three web applications to production.',
      items: [
        {
          name: 'Headless CMS inspired by Strapi',
          points: [
            'Content-Type Builder that generates REST APIs automatically (14 field types, pagination, filtering, draft/publish).',
            'Next.js admin panel: drag-and-drop content editor, media library with automatic thumbnails, PHP client SDK.',
          ],
          tech: techInternship.cms,
        },
        {
          name: 'Mongolian Au Pair website',
          points: [
            'Live company website powered by the headless CMS: dynamic programme pages, FAQ, gallery, testimonials, contact form.',
            'Alternative PHP version consuming the same API.',
          ],
          tech: techInternship.aupair,
          link: { label: 'mongolian-aupair.com', href: 'https://mongolian-aupair.com' },
        },
        {
          name: 'correctURL — URL shortener',
          points: [
            'Short links with custom slugs, click statistics and correct percent-encoding handling.',
            'Deployed with Docker and Nginx on a Linux server.',
          ],
          tech: techInternship.correct,
        },
      ],
    },
    projects: {
      title: 'Projects',
      filters: { all: 'All', internship: 'Internship', university: 'University', demo: 'Playable demo' },
      code: 'Code',
      live: 'Live site',
      play: 'Play',
      close: 'Close',
      private: 'Private code (company)',
    },
    skills: {
      title: 'Skills',
      groups: [
        { name: 'Languages', items: ['JavaScript', 'Java', 'PHP', 'Python', 'SQL', 'C#', 'Kotlin', 'C / C++'] },
        { name: 'Front-end', items: ['React', 'Next.js', 'Tailwind CSS', 'HTML / CSS', 'JavaFX'] },
        { name: 'Back-end', items: ['Node.js', 'Express', 'REST APIs'] },
        { name: 'Data & DevOps', items: ['PostgreSQL', 'MySQL / MariaDB', 'Docker', 'Nginx', 'Linux', 'Git / GitHub'] },
        { name: 'Strengths', items: ['Autonomy', 'Teamwork', 'Problem solving', 'Fast learner', 'Communication'] },
      ],
    },
    education: {
      title: 'Education',
      items: [{ name: 'BUT Informatique (Bachelor of Technology in Computer Science)', school: 'IUT du Limousin, Limoges, France', date: '2024 – 2027', note: 'Currently in 3rd year' }],
    },
    contact: {
      title: 'Contact',
      text: 'Looking for a motivated intern from March 2027? Drop me a line — I reply quickly.',
      cvFr: 'Resume (French)',
      cvEn: 'Resume (English)',
    },
    footer: 'Designed and built by Barsbold Myanganbaatar',
  },
};

// Projects: `category` drives the filter; `demo` opens a playable game.
export const projects = [
  {
    id: 'cms', category: 'internship', icon: '🧩',
    title: { fr: 'CMS headless', en: 'Headless CMS' },
    desc: {
      fr: 'CMS inspiré de Strapi : API REST générée automatiquement, éditeur en glisser-déposer, médiathèque.',
      en: 'Strapi-inspired CMS: auto-generated REST API, drag-and-drop editor, media library.',
    },
    tags: ['Node.js', 'PostgreSQL', 'Next.js', 'Docker'],
    private: true,
  },
  {
    id: 'aupair', category: 'internship', icon: '🌍',
    title: { fr: 'Mongolian Au Pair', en: 'Mongolian Au Pair' },
    desc: {
      fr: 'Site vitrine en production alimenté par le CMS headless, avec une version Next.js et une version PHP.',
      en: 'Live company website powered by the headless CMS, with a Next.js version and a PHP version.',
    },
    tags: ['Next.js 16', 'React 19', 'Tailwind CSS', 'PHP'],
    live: 'https://mongolian-aupair.com',
  },
  {
    id: 'correcturl', category: 'internship', icon: '🔗',
    title: { fr: 'correctURL', en: 'correctURL' },
    desc: {
      fr: 'Raccourcisseur d’URL avec statistiques de clics, mis en production avec Docker et Nginx.',
      en: 'URL shortener with click statistics, deployed with Docker and Nginx.',
    },
    tags: ['Next.js', 'PostgreSQL', 'Docker'],
    private: true,
  },
  {
    id: 'latice', category: 'university', icon: '🐢', demo: 'latice',
    title: { fr: 'Jeu Latice', en: 'Latice board game' },
    desc: {
      fr: 'Jeu de plateau en Java/JavaFX (équipe de 4) : moteur de jeu, règles de placement, calcul des points. Version web jouable ici.',
      en: 'Board game in Java/JavaFX (team of 4): game engine, placement rules, scoring. A web version is playable here.',
    },
    tags: ['Java', 'JavaFX', 'MVC', 'Git'],
    code: 'https://github.com/Myanganbaatar/Jeu-Latice',
  },
  {
    id: 'python', category: 'university', icon: '🎲', demo: 'python',
    title: { fr: 'Mini-jeux Python', en: 'Python mini-games' },
    desc: {
      fr: 'Morpion, Puissance 4, Allumettes et Devinette, en mode joueur contre joueur ou contre l’ordinateur. Portés sur le web.',
      en: 'Tic-tac-toe, Connect Four, Matches and Guessing game, player vs player or vs computer. Ported to the web.',
    },
    tags: ['Python', 'Algorithmique', 'React'],
    code: 'https://github.com/Myanganbaatar/SAE-PYTHON',
  },
  {
    id: 'questionary', category: 'university', icon: '📋',
    title: { fr: 'Questionary', en: 'Questionary' },
    desc: {
      fr: 'Plateforme de questionnaires accessibles par code ou QR code (équipe de 5) : back-end PHP en MVC, base MariaDB, résultats en graphiques.',
      en: 'Survey platform reachable by code or QR code (team of 5): PHP MVC back end, MariaDB database, charts for results.',
    },
    tags: ['PHP', 'JavaScript', 'MariaDB', 'Chart.js'],
    code: 'https://github.com/Mdeterne/php-mariadb-Questionary',
  },
  {
    id: 'netflix', category: 'university', icon: '🎬',
    title: { fr: 'Étude Netflix', en: 'Netflix study' },
    desc: {
      fr: 'Architecture d’une plateforme de streaming : back-end, front-end utilisateur et front-end administrateur.',
      en: 'Streaming-platform architecture: back end, user front end and admin front end.',
    },
    tags: ['JavaScript', 'Node.js', 'CSS'],
    code: 'https://github.com/Myanganbaatar/Netflix',
  },
  {
    id: 'kotlin', category: 'university', icon: '📱',
    title: { fr: 'Gestionnaire de tâches Android', en: 'Android task manager' },
    desc: {
      fr: 'Application Android native en Kotlin : ajout et modification de tâches, sélection de photos, recherche.',
      en: 'Native Android app in Kotlin: add and edit tasks, photo picker, search.',
    },
    tags: ['Kotlin', 'Android', 'Gradle'],
    code: 'https://github.com/Myanganbaatar/Projet-Kotlin',
  },
  {
    id: 'maui', category: 'university', icon: '💠',
    title: { fr: 'Application .NET MAUI', en: '.NET MAUI app' },
    desc: {
      fr: 'Application multiplateforme en C# avec le pattern MVVM et des notifications locales.',
      en: 'Cross-platform C# app using the MVVM pattern, with local notifications.',
    },
    tags: ['C#', '.NET MAUI', 'MVVM'],
    code: 'https://github.com/Myanganbaatar/ProjetMAUI',
  },
];

// Long-form content for /projects/:id pages.
export const projectDetails = {
  cms: {
    context: {
      fr: "Projet phare de mon stage chez IT Partner : un CMS headless complet, pensé comme une alternative maison à Strapi, qui sert aujourd'hui de back-office à des sites clients.",
      en: 'The flagship project of my internship at IT Partner: a complete headless CMS, built as an in-house alternative to Strapi, now used as the back office of client websites.',
    },
    highlights: {
      fr: [
        'Content-Type Builder : création dynamique de collections avec 14 types de champs (texte, richtext, média, relation, enum, JSON…).',
        'API REST générée automatiquement pour chaque collection : pagination, tri, filtres, brouillon/publication.',
        'Panneau d’administration Next.js : éditeur en glisser-déposer (dnd-kit), médiathèque avec miniatures générées par sharp.',
        'SDK PHP pour consommer l’API ; déploiement Docker Compose (PostgreSQL, API, admin, Nginx) sur un serveur Linux.',
      ],
      en: [
        'Content-Type Builder: dynamic collections with 14 field types (text, rich text, media, relation, enum, JSON…).',
        'Auto-generated REST API for every collection: pagination, sorting, filtering, draft/publish.',
        'Next.js admin panel: drag-and-drop editor (dnd-kit), media library with thumbnails generated by sharp.',
        'PHP SDK to consume the API; Docker Compose deployment (PostgreSQL, API, admin, Nginx) on a Linux server.',
      ],
    },
    stack: ['Node.js', 'Express', 'PostgreSQL', 'Next.js', 'Tailwind CSS', 'Docker', 'Nginx', 'PHP'],
  },
  aupair: {
    context: {
      fr: "Site vitrine d'une agence de programmes au pair, en production. Tout le contenu (programmes, FAQ, témoignages, galerie) est géré depuis le CMS headless que j'ai développé.",
      en: 'Live showcase website for an au pair programme agency. All content (programmes, FAQ, testimonials, gallery) is managed from the headless CMS I built.',
    },
    highlights: {
      fr: [
        'Next.js 16 (App Router) avec rendu côté serveur des données du CMS.',
        'Pages programmes générées dynamiquement à partir des slugs : présentation, avantages, FAQ.',
        'Galerie, témoignages, statistiques et formulaire de contact.',
        'Version PHP alternative consommant la même API, pour un hébergement mutualisé.',
      ],
      en: [
        'Next.js 16 (App Router) with server-side rendering of CMS data.',
        'Programme pages generated dynamically from slugs: overview, benefits, FAQ.',
        'Gallery, testimonials, stats and contact form.',
        'Alternative PHP version consuming the same API, for shared hosting.',
      ],
    },
    stack: ['Next.js 16', 'React 19', 'Tailwind CSS 4', 'PHP'],
  },
  correcturl: {
    context: {
      fr: "Raccourcisseur d'URL public avec statistiques. Le défi principal : le protéger contre le spam et les bots une fois en ligne.",
      en: 'A public URL shortener with analytics. The main challenge: protecting it against spam and bots once online.',
    },
    highlights: {
      fr: [
        'Création de liens courts avec slugs personnalisés et gestion correcte du percent-encoding.',
        'Page de statistiques par lien et historique des liens de chaque visiteur (cookie anonyme).',
        'Image Docker multi-étapes (Next.js standalone) et base PostgreSQL.',
      ],
      en: [
        'Short links with custom slugs and correct percent-encoding handling.',
        'Per-link statistics page and per-visitor link history (anonymous cookie).',
        'Multi-stage Docker image (Next.js standalone) and PostgreSQL database.',
      ],
    },
    stack: ['Next.js 14', 'PostgreSQL', 'Docker', 'Nginx'],
  },
  latice: {
    context: {
      fr: 'SAÉ de 1ʳᵉ année (février – mai 2025) : développer en équipe de 4 le jeu de plateau Latice, où les joueurs posent des tuiles qui doivent correspondre par forme ou par couleur.',
      en: 'First-year university project (Feb – May 2025): a team of 4 building the Latice board game, where players place tiles that must match by shape or colour.',
    },
    highlights: {
      fr: [
        'Moteur de jeu : gestion des tuiles, règles de placement et calcul des points.',
        'Interface graphique en JavaFX suivant une architecture MVC.',
        'Travail en équipe avec Git, tests et débogage de l’interface.',
        'Portage web en React jouable directement sur ce portfolio.',
      ],
      en: [
        'Game engine: tile management, placement rules and scoring.',
        'JavaFX graphical interface following an MVC architecture.',
        'Teamwork with Git, joint testing and debugging of the interface.',
        'React web port playable directly on this portfolio.',
      ],
    },
    stack: ['Java', 'JavaFX', 'MVC', 'Git', 'React'],
  },
  python: {
    context: {
      fr: 'SAÉ Python : une suite de quatre jeux classiques avec une architecture modulaire, puis portée sur le web pour ce portfolio.',
      en: 'Python university project: a suite of four classic games with a modular architecture, later ported to the web for this portfolio.',
    },
    highlights: {
      fr: [
        'Morpion (3×3), Puissance 4 (6×7), Allumettes et Devinette.',
        'Mode joueur contre joueur et joueur contre ordinateur.',
        'Architecture modulaire pour ajouter facilement de nouveaux jeux.',
      ],
      en: [
        'Tic-tac-toe (3×3), Connect Four (6×7), Matches and Guessing game.',
        'Player vs player and player vs computer modes.',
        'Modular architecture to add new games easily.',
      ],
    },
    stack: ['Python', 'Algorithmique', 'React'],
  },
  questionary: {
    context: {
      fr: 'SAÉ de 2ᵉ année (septembre 2025 – mars 2026, équipe de 5) : une plateforme web pour créer et diffuser des questionnaires accessibles par code ou QR code.',
      en: 'Second-year university project (Sep 2025 – Mar 2026, team of 5): a web platform to create and share surveys reachable by code or QR code.',
    },
    highlights: {
      fr: [
        'Back-end PHP en architecture MVC, sans framework.',
        'Base de données MariaDB : conception et requêtes.',
        'Sécurité : sessions, protection contre les injections SQL et le XSS.',
        'Visualisation des résultats avec Chart.js.',
      ],
      en: [
        'PHP back end with an MVC architecture, no framework.',
        'MariaDB database: design and queries.',
        'Security: sessions, protection against SQL injection and XSS.',
        'Results visualised with Chart.js.',
      ],
    },
    stack: ['PHP', 'JavaScript', 'MariaDB', 'Chart.js'],
  },
  netflix: {
    context: {
      fr: 'Projet de cours sur les architectures web : concevoir une plateforme de streaming inspirée de Netflix.',
      en: 'Web architecture course project: designing a Netflix-inspired streaming platform.',
    },
    highlights: {
      fr: [
        'Séparation en back-end, front-end utilisateur et front-end administrateur.',
        'Réflexion sur les microservices, le CDN et la tolérance aux pannes (circuit breaker).',
      ],
      en: [
        'Split into a back end, a user front end and an admin front end.',
        'Study of microservices, CDNs and fault tolerance (circuit breaker).',
      ],
    },
    stack: ['JavaScript', 'Node.js', 'CSS'],
  },
  kotlin: {
    context: {
      fr: 'Application Android native développée en Kotlin dans le cadre du BUT.',
      en: 'Native Android application built in Kotlin as part of my degree.',
    },
    highlights: {
      fr: ['Création et modification de tâches.', 'Sélection de photos pour une tâche.', 'Barre de recherche.'],
      en: ['Create and edit tasks.', 'Attach photos to a task.', 'Search bar.'],
    },
    stack: ['Kotlin', 'Android', 'Gradle'],
  },
  maui: {
    context: {
      fr: 'Application multiplateforme en C# / .NET MAUI réalisée dans le cadre du BUT.',
      en: 'Cross-platform C# / .NET MAUI app built as part of my degree.',
    },
    highlights: {
      fr: ['Pattern MVVM et interfaces en XAML.', 'Notifications locales.'],
      en: ['MVVM pattern and XAML views.', 'Local notifications.'],
    },
    stack: ['C#', '.NET MAUI', 'XAML', 'MVVM'],
  },
};

// UI strings shared by the multi-page layout.
export const ui = {
  fr: {
    home: 'Accueil',
    featured: 'Projets à la une',
    allProjects: 'Tous les projets',
    moreAbout: 'En savoir plus sur moi',
    seeExperience: 'Voir mon expérience',
    backToProjects: '← Tous les projets',
    context: 'Contexte',
    highlights: 'Ce que j’ai réalisé',
    stack: 'Technologies',
    next: 'Projet suivant',
    playTitle: 'Démo jouable',
    notFound: 'Cette page n’existe pas.',
    backHome: 'Retour à l’accueil',
    theme: 'Changer de thème',
    menu: 'Menu',
    copy: 'Copier',
    copied: 'Copié !',
    whatIDo: 'Ce que je fais',
    services: [
      { icon: '⚙️', title: 'Back-end & API', text: 'API REST en Node.js et Express, bases de données PostgreSQL et MySQL.' },
      { icon: '🖥️', title: 'Front-end', text: 'Interfaces React / Next.js rapides, accessibles et responsives.' },
      { icon: '🚀', title: 'Déploiement', text: 'Docker, Nginx et serveurs Linux : du code à la production.' },
    ],
    ctaTitle: 'Un stage de 16 semaines à partir de mars 2027 ?',
    ctaText: 'Je serais ravi d’échanger avec votre équipe.',
    ctaButton: 'Me contacter',
  },
  en: {
    home: 'Home',
    featured: 'Featured projects',
    allProjects: 'All projects',
    moreAbout: 'More about me',
    seeExperience: 'See my experience',
    backToProjects: '← All projects',
    context: 'Context',
    highlights: 'What I built',
    stack: 'Tech stack',
    next: 'Next project',
    playTitle: 'Playable demo',
    notFound: 'This page does not exist.',
    backHome: 'Back to home',
    theme: 'Toggle theme',
    menu: 'Menu',
    copy: 'Copy',
    copied: 'Copied!',
    whatIDo: 'What I do',
    services: [
      { icon: '⚙️', title: 'Back end & APIs', text: 'REST APIs with Node.js and Express, PostgreSQL and MySQL databases.' },
      { icon: '🖥️', title: 'Front end', text: 'Fast, accessible and responsive React / Next.js interfaces.' },
      { icon: '🚀', title: 'Deployment', text: 'Docker, Nginx and Linux servers: from code to production.' },
    ],
    ctaTitle: 'A 16-week internship from March 2027?',
    ctaText: 'I would be glad to talk with your team.',
    ctaButton: 'Get in touch',
  },
};
