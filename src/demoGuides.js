// Plain-language guides shown next to each demo on the Projects page.
// Written for readers with no technical background (recruiters, HR).
// what: one-sentence summary · why: what it is for · did: my part · steps: what to click.

const demoGuides = {
  cms: {
    fr: {
      what: 'Un « back-office » : l’espace d’administration où une entreprise modifie le contenu de son site web, sans toucher au code.',
      why: 'Avant, chaque changement de texte demandait un développeur. Avec ce CMS, l’équipe de l’agence met à jour son site elle-même.',
      did: [
        'Créer des types de contenu (FAQ, pages…) en quelques clics.',
        'Générer automatiquement l’API qui envoie ces contenus au site.',
        'Gérer les brouillons et la publication, les rôles et les médias.',
      ],
      steps: [
        'Changez le titre (« title »), puis cliquez sur « Publish » : le site du café se met à jour.',
        'Changez-le encore et cliquez seulement sur « Save » : c’est un brouillon, le site ne change pas.',
        'Choisissez « Product », changez un prix ou ajoutez un produit, puis publiez.',
      ],
    },
    en: {
      what: 'A “back office”: the admin space where a company edits the content of its website without touching any code.',
      why: 'Before, every text change needed a developer. With this CMS, the agency’s team updates its own website.',
      did: [
        'Create content types (FAQ, pages…) in a few clicks.',
        'Automatically generate the API that sends this content to the website.',
        'Handle drafts and publishing, roles and media.',
      ],
      steps: [
        'Change the title (“title”), then click “Publish”: the café website updates.',
        'Change it again and only click “Save”: it is a draft, the site does not change.',
        'Pick “Product”, change a price or add a product, then publish.',
      ],
    },
  },
  aupair: {
    fr: {
      what: 'Le site public d’une agence mongole qui aide les jeunes à partir en Allemagne et en Autriche (au pair, Ausbildung, FSJ…).',
      why: 'Les jeunes et leurs familles y trouvent les programmes, les conditions et un formulaire d’inscription.',
      did: [
        'Construire le site en Next.js, adapté au mobile.',
        'Le relier au CMS : tous les textes viennent de l’espace d’administration.',
        'Mettre en ligne le site sur mongolian-aupair.com.',
      ],
      steps: [
        'Ouvrez le menu « Зуучлалийн хөтөлбөрүүд » (programmes) et choisissez un programme.',
        'Ouvrez une question de la FAQ : le texte vient du CMS.',
        'En bas, essayez le formulaire d’inscription (rien n’est envoyé).',
      ],
    },
    en: {
      what: 'The public website of a Mongolian agency that helps young people go to Germany and Austria (au pair, Ausbildung, FSJ…).',
      why: 'Young people and their families find the programmes, the requirements and a sign-up form.',
      did: [
        'Build the website with Next.js, mobile friendly.',
        'Connect it to the CMS: every text comes from the admin space.',
        'Put the website online at mongolian-aupair.com.',
      ],
      steps: [
        'Open the “Зуучлалийн хөтөлбөрүүд” (programmes) menu and pick a programme.',
        'Open an FAQ question: the text comes from the CMS.',
        'At the bottom, try the sign-up form (nothing is sent).',
      ],
    },
  },
  correcturl: {
    fr: {
      what: 'Un raccourcisseur de liens : il transforme une adresse web très longue en un lien court, facile à partager.',
      why: 'L’entreprise partage ses liens sur les réseaux sociaux et veut savoir combien de personnes cliquent, depuis quel pays et quel appareil.',
      did: [
        'Créer les liens courts et vérifier que l’adresse est valide.',
        'Enregistrer chaque clic et afficher des statistiques.',
        'Mettre l’outil en production sur un serveur Linux (Docker, Nginx), avec un blocage des robots.',
      ],
      steps: [
        'Collez une adresse (ou cliquez sur « Exemple ») puis « Богиносгох » (raccourcir).',
        'Cliquez sur « Нээх → » (ouvrir) : le compteur de visites augmente.',
        'Cliquez sur « Аналитик » pour voir les statistiques du lien.',
      ],
    },
    en: {
      what: 'A link shortener: it turns a very long web address into a short link that is easy to share.',
      why: 'The company shares its links on social media and wants to know how many people click, from which country and device.',
      did: [
        'Create short links and check that the address is valid.',
        'Record every click and show statistics.',
        'Run it in production on a Linux server (Docker, Nginx), with bot blocking.',
      ],
      steps: [
        'Paste an address (or click “Exemple”) then “Богиносгох” (shorten).',
        'Click “Нээх →” (open): the visit counter goes up.',
        'Click “Аналитик” to see the link’s statistics.',
      ],
    },
  },
  questionary: {
    fr: {
      what: 'Une plateforme de questionnaires pour l’université : les enseignants créent un sondage, les étudiants répondent avec un code.',
      why: 'Recueillir l’avis des étudiants (sur une matière, un stage, l’année) et voir les résultats tout de suite en graphiques.',
      did: [
        'Projet d’équipe (5 étudiants) en PHP avec une base de données MariaDB.',
        'Accès par code PIN ou QR code, plusieurs types de questions.',
        'Page d’analyse avec graphiques et export des réponses.',
      ],
      steps: [
        'Cliquez sur le code de démo, puis « Valider ».',
        'Répondez aux questions et envoyez.',
        'Cliquez sur « Voir côté enseignant » : votre réponse apparaît dans les graphiques.',
      ],
    },
    en: {
      what: 'A survey platform for the university: teachers create a survey, students answer with a code.',
      why: 'Collect students’ opinions (on a course, an internship, the year) and see the results right away as charts.',
      did: [
        'Team project (5 students) in PHP with a MariaDB database.',
        'Access with a PIN code or QR code, several question types.',
        'Analysis page with charts and export of the answers.',
      ],
      steps: [
        'Click the demo code, then “Valider”.',
        'Answer the questions and send.',
        'Click “Voir côté enseignant”: your answer appears in the charts.',
      ],
    },
  },
  netflix: {
    fr: {
      what: 'Une plateforme de location de films, inspirée de Netflix.',
      why: 'Parcourir un catalogue, louer un film pour 7 jours et suivre ses locations.',
      did: [
        'Interface en React, serveur en Node.js (Express) et base MongoDB.',
        'Règles métier : durée de 7 jours, pas deux fois le même film en même temps.',
        'Panier, connexion et compte à rebours des locations.',
      ],
      steps: ['Filtrez le catalogue par genre ou cherchez un titre.', 'Ajoutez un film au panier et validez la location.', 'Regardez le journal de l’API : chaque action envoie une requête.'],
    },
    en: {
      what: 'A movie rental platform inspired by Netflix.',
      why: 'Browse a catalogue, rent a movie for 7 days and follow your rentals.',
      did: [
        'React interface, Node.js (Express) server and MongoDB database.',
        'Business rules: 7-day rentals, never the same movie twice at the same time.',
        'Cart, sign-in and a countdown for each rental.',
      ],
      steps: ['Filter the catalogue by genre or search for a title.', 'Add a movie to the cart and confirm the rental.', 'Look at the API log: each action sends a request.'],
    },
  },
  kotlin: {
    fr: {
      what: 'Une application Android pour organiser ses tâches, avec un petit jeu de points pour rester motivé.',
      why: 'Classer ses tâches par priorité et catégorie, et gagner des points en les terminant.',
      did: ['Application native en Kotlin avec Jetpack Compose.', 'Ajout, modification, filtres, recherche et photo.', 'Points et rang qui évoluent quand on termine une tâche.'],
      steps: ['Cochez « Acheter du café » : vous gagnez 30 points.', 'Utilisez les filtres en haut (statut, catégorie).', 'Appuyez sur « + » pour créer une nouvelle tâche.'],
    },
    en: {
      what: 'An Android app to organise tasks, with a small points game to stay motivated.',
      why: 'Sort tasks by priority and category, and earn points by finishing them.',
      did: ['Native app in Kotlin with Jetpack Compose.', 'Add, edit, filters, search and photo.', 'Points and a rank that change when a task is done.'],
      steps: ['Tick “Acheter du café”: you earn 30 points.', 'Use the filters at the top (status, category).', 'Tap “+” to create a new task.'],
    },
  },
  maui: {
    fr: {
      what: 'Une application mobile pour découvrir les pays du monde, qui fonctionne sur Android, iOS et Windows avec un seul code.',
      why: 'Voir les pays par continent, leur capitale et leur population, et garder ses propres éléments avec photo.',
      did: ['Application en C# / .NET MAUI, organisée en MVVM.', 'Liste des pays chargée depuis une API, avec une liste de secours.', 'Formulaire avec vérifications, mode sombre et notifications.'],
      steps: ['Ouvrez l’onglet « Profile » et choisissez un continent.', 'Touchez un pays pour voir sa fiche.', 'Dans « Settings », activez le mode sombre.'],
    },
    en: {
      what: 'A mobile app to discover the world’s countries, running on Android, iOS and Windows from a single code base.',
      why: 'See countries by continent, their capital and population, and keep your own items with a photo.',
      did: ['C# / .NET MAUI app, organised with MVVM.', 'Country list loaded from an API, with a fallback list.', 'Form with checks, dark mode and notifications.'],
      steps: ['Open the “Profile” tab and pick a continent.', 'Tap a country to see its details.', 'In “Settings”, turn on dark mode.'],
    },
  },
  latice: {
    fr: {
      what: 'Un jeu de plateau (Latice) : on pose des tuiles qui ont la même couleur ou la même forme que leurs voisines.',
      why: 'Projet universitaire pour travailler la programmation orientée objet et les règles d’un vrai jeu.',
      did: ['Jeu développé en équipe de 4, en Java avec une interface JavaFX.', 'Règles complètes et adversaire robot.', 'Version web jouable directement ici.'],
      steps: ['Choisissez une tuile dans votre main.', 'Posez-la sur une case où elle correspond à ses voisines.', 'Jouez contre le robot.'],
    },
    en: {
      what: 'A board game (Latice): you place tiles that match their neighbours by colour or shape.',
      why: 'University project to practise object-oriented programming and the rules of a real game.',
      did: ['Game built by a team of 4, in Java with a JavaFX interface.', 'Full rules and a robot opponent.', 'Web version playable right here.'],
      steps: ['Pick a tile from your hand.', 'Place it where it matches its neighbours.', 'Play against the robot.'],
    },
  },
  python: {
    fr: {
      what: 'Quatre petits jeux classiques (morpion, Puissance 4, allumettes, devinette), à deux joueurs ou contre l’ordinateur.',
      why: 'Projet universitaire : bien organiser le code pour ajouter facilement de nouveaux jeux, et faire jouer l’ordinateur.',
      did: ['Jeux écrits en Python.', 'Un adversaire ordinateur pour chaque jeu.', 'Recréés en version web pour être jouables ici.'],
      steps: ['Choisissez un jeu.', 'Jouez contre l’ordinateur ou à deux.', 'Essayez de gagner !'],
    },
    en: {
      what: 'Four small classic games (tic-tac-toe, Connect Four, matches, guessing game), for two players or against the computer.',
      why: 'University project: organise the code so new games are easy to add, and let the computer play.',
      did: ['Games written in Python.', 'A computer opponent for each game.', 'Rebuilt for the web so they can be played here.'],
      steps: ['Choose a game.', 'Play against the computer or with a friend.', 'Try to win!'],
    },
  },
};

export default demoGuides;
