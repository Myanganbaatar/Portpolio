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
      role: 'Développeur web full-stack · Interfaces React / Next.js et API Node.js',
      status: 'Disponible en stage dès mars 2027 · 16 semaines',
      pitch: "Étudiant en 3ᵉ année de BUT Informatique, je développe des applications web complètes : l'interface en React / Next.js, l'API en Node.js et la base PostgreSQL. En stage chez IT Partner, j'ai mis en production 3 applications, dont le site mongolian-aupair.com.",
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
        "Je suis étudiant en 3ᵉ année de BUT Informatique à l'IUT du Limousin (Limoges). Je développe des applications web, de l'interface jusqu'à la mise en ligne : React / Next.js pour le front-end, Node.js et Express pour l'API, PostgreSQL pour les données, Docker et Nginx pour le déploiement.",
        "Ce qui m'intéresse le plus : relier une interface à une API et la mettre en production. Pendant mon stage, j'ai construit un CMS headless avec son API REST, puis un site en ligne qui utilise cette API (mongolian-aupair.com).",
        "Mon objectif : devenir développeur web full-stack dans une équipe qui crée des produits utilisés par de vrais clients. Pour commencer, je cherche un stage de 16 semaines dès mars 2027, puis une alternance.",
      ],
      facts: [
        { label: 'Localisation', value: 'Limoges, France' },
        { label: 'Formation', value: 'BUT Informatique · 2024 – 2027' },
        { label: 'Langues', value: 'Mongol (natif) · Français · Anglais' },
        { label: 'Objectif', value: 'Développeur web full-stack · stage 16 semaines dès mars 2027, puis alternance' },
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
      filters: { all: 'Tous', internship: 'Stage', university: 'IUT', demo: 'Avec démo' },
      code: 'Code',
      live: 'Site en ligne',
      play: 'Jouer',
      close: 'Fermer',
      private: 'Code privé (entreprise)',
      result: 'Résultat',
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
    footerSource: 'Code source de ce site (React)',
  },

  en: {
    nav: { about: 'About', experience: 'Experience', projects: 'Projects', skills: 'Skills', contact: 'Contact', cv: 'Resume' },
    hero: {
      hello: "Hi, I'm",
      role: 'Full-stack web developer · React / Next.js front ends and Node.js APIs',
      status: 'Available for an internship from March 2027 · 16 weeks',
      pitch: 'Third-year Computer Science student. I build complete web applications: the front end in React / Next.js, the API in Node.js and the PostgreSQL database. During my internship at IT Partner I shipped 3 applications to production, including the mongolian-aupair.com website.',
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
        "I'm a third-year Computer Science student (BUT Informatique) at IUT du Limousin in Limoges, France. I build web applications from the interface to production: React / Next.js for the front end, Node.js and Express for the API, PostgreSQL for data, Docker and Nginx for deployment.",
        "What interests me most: connecting a front end to an API and shipping it to production. During my internship I built a headless CMS with its REST API, then a live website that uses this API (mongolian-aupair.com).",
        "My goal: become a full-stack web developer in a team that builds products used by real customers. To start, I'm looking for a 16-week internship from March 2027, then a work-study contract.",
      ],
      facts: [
        { label: 'Location', value: 'Limoges, France' },
        { label: 'Education', value: 'BUT Informatique · 2024 – 2027' },
        { label: 'Languages', value: 'Mongolian (native) · French · English' },
        { label: 'Goal', value: 'Full-stack web developer · 16-week internship from March 2027, then work-study' },
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
      filters: { all: 'All', internship: 'Internship', university: 'University', demo: 'With demo' },
      code: 'Code',
      live: 'Live site',
      play: 'Play',
      close: 'Close',
      private: 'Private code (company)',
      result: 'Result',
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
    footerSource: 'Source code of this site (React)',
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
    result: {
      fr: 'En production : back-office de sites clients, API générée pour 14 types de champs.',
      en: 'In production as the back office of client websites, with APIs generated for 14 field types.',
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
    result: {
      fr: 'Site en ligne sur mongolian-aupair.com, tout le contenu géré depuis le CMS.',
      en: 'Live at mongolian-aupair.com, with all content managed from the CMS.',
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
    result: {
      fr: 'Déployé en production sur un serveur Linux avec Docker et Nginx.',
      en: 'Deployed to production on a Linux server with Docker and Nginx.',
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
    result: {
      fr: 'Jeu complet livré en équipe de 4, avec une version web jouable ici.',
      en: 'Complete game delivered by a team of 4, with a web version playable here.',
    },
    tags: ['Java', 'JavaFX', 'MVC', 'Git'],
    code: 'https://github.com/Myanganbaatar/SAE-de-Java-jeu-latice-',
  },
  {
    id: 'python', category: 'university', icon: '🎲', demo: 'python',
    title: { fr: 'Mini-jeux Python', en: 'Python mini-games' },
    desc: {
      fr: 'Morpion, Puissance 4, Allumettes et Devinette, en mode joueur contre joueur ou contre l’ordinateur. Portés sur le web.',
      en: 'Tic-tac-toe, Connect Four, Matches and Guessing game, player vs player or vs computer. Ported to the web.',
    },
    result: {
      fr: '4 jeux livrés, contre un joueur ou l’ordinateur, jouables ici.',
      en: '4 games delivered, against a player or the computer, playable here.',
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
    result: {
      fr: 'Plateforme livrée en équipe de 5 : accès par code ou QR code, résultats en graphiques.',
      en: 'Platform delivered by a team of 5: access by code or QR code, results shown as charts.',
    },
    tags: ['PHP', 'JavaScript', 'MariaDB', 'Chart.js'],
    code: 'https://github.com/Mdeterne/php-mariadb-Questionary',
  },
  {
    id: 'netflix', category: 'university', icon: '🎬',
    title: { fr: 'Location de films (Netflix)', en: 'Movie rentals (Netflix)' },
    desc: {
      fr: 'Plateforme de location de films inspirée de Netflix : catalogue filtrable, panier, locations de 7 jours, API REST Express + MongoDB.',
      en: 'Netflix-inspired movie rental platform: filterable catalogue, cart, 7-day rentals, Express + MongoDB REST API.',
    },
    result: {
      fr: 'Parcours complet de location : recherche, panier, connexion, suivi des locations avec compte à rebours.',
      en: 'Complete rental flow: search, cart, sign-in, rental tracking with a countdown.',
    },
    tags: ['React', 'Express', 'MongoDB', 'Tailwind CSS'],
    code: 'https://github.com/Myanganbaatar/Netflix',
  },
  {
    id: 'kotlin', category: 'university', icon: '📱',
    title: { fr: 'Gestionnaire de tâches Android', en: 'Android task manager' },
    desc: {
      fr: 'Application Android native en Kotlin : ajout et modification de tâches, sélection de photos, recherche.',
      en: 'Native Android app in Kotlin: add and edit tasks, photo picker, search.',
    },
    result: {
      fr: 'Application Android native : création de tâches, photos et recherche.',
      en: 'Native Android app: task creation, photos and search.',
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
    result: {
      fr: 'Application multiplateforme en MVVM avec notifications locales.',
      en: 'Cross-platform MVVM app with local notifications.',
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
      fr: 'Projet de cours sur les architectures web : une plateforme de location de films inspirée de Netflix, avec un front-end utilisateur, un panneau d’administration et une API.',
      en: 'Web architecture course project: a Netflix-inspired movie rental platform with a user front end, an admin panel and an API.',
    },
    highlights: {
      fr: [
        'Front-end React (Vite, Tailwind CSS) : catalogue avec recherche et filtre par genre, panier, page « Mes locations » avec compte à rebours.',
        'API REST Express + MongoDB (Mongoose) : films (CRUD, statistiques), locations, authentification.',
        'Règles métier : location de 7 jours, refus d’une deuxième location active du même film, expiration automatique.',
        'Panneau d’administration rendu côté serveur avec EJS.',
        'Réflexion sur les microservices, le CDN et la tolérance aux pannes (circuit breaker).',
      ],
      en: [
        'React front end (Vite, Tailwind CSS): catalogue with search and genre filter, cart, “My rentals” page with a countdown.',
        'Express + MongoDB (Mongoose) REST API: movies (CRUD, statistics), rentals, authentication.',
        'Business rules: 7-day rentals, a second active rental of the same movie is refused, automatic expiry.',
        'Server-side rendered admin panel with EJS.',
        'Study of microservices, CDNs and fault tolerance (circuit breaker).',
      ],
    },
    stack: ['React', 'Vite', 'Tailwind CSS', 'Express', 'MongoDB', 'Mongoose', 'EJS'],
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
    whatIDo: 'Compétences clés',
    services: [
      { icon: '⚙️', title: 'Back-end & API', text: 'Node.js, Express, PostgreSQL. Preuve : l’API REST du CMS headless, générée pour 14 types de champs.' },
      { icon: '🖥️', title: 'Front-end', text: 'React, Next.js, Tailwind CSS. Preuve : le site mongolian-aupair.com, en ligne et relié à l’API du CMS.' },
      { icon: '🚀', title: 'Déploiement', text: 'Docker, Nginx, Linux. Preuve : correctURL et le CMS mis en production sur un serveur Linux.' },
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
    whatIDo: 'Key skills',
    services: [
      { icon: '⚙️', title: 'Back end & APIs', text: 'Node.js, Express, PostgreSQL. Proof: the headless CMS REST API, generated for 14 field types.' },
      { icon: '🖥️', title: 'Front end', text: 'React, Next.js, Tailwind CSS. Proof: mongolian-aupair.com, live and connected to the CMS API.' },
      { icon: '🚀', title: 'Deployment', text: 'Docker, Nginx, Linux. Proof: correctURL and the CMS shipped to production on a Linux server.' },
    ],
    ctaTitle: 'A 16-week internship from March 2027?',
    ctaText: 'I would be glad to talk with your team.',
    ctaButton: 'Get in touch',
  },
};
