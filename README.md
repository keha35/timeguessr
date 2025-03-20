# TimeGuessr - Compétition Hebdomadaire

Une application web pour organiser des compétitions hebdomadaires autour du jeu TimeGuessr.

## Fonctionnalités

- Authentification des utilisateurs via Google
- Soumission des scores avec captures d'écran
- Classement hebdomadaire
- Historique des classements passés
- Système de points (1 point par victoire journalière)

## Prérequis

- Node.js 18+
- PostgreSQL
- Compte Google Cloud Platform pour l'authentification

## Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/votre-username/timeguessr.git
cd timeguessr
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez les variables d'environnement :
- Copiez le fichier `.env.example` vers `.env`
- Remplissez les variables suivantes :
  - `DATABASE_URL` : URL de connexion à votre base de données PostgreSQL
  - `NEXTAUTH_URL` : URL de votre application (http://localhost:3000 en développement)
  - `NEXTAUTH_SECRET` : Une chaîne aléatoire pour sécuriser les sessions
  - `GOOGLE_CLIENT_ID` : ID client OAuth Google
  - `GOOGLE_CLIENT_SECRET` : Secret client OAuth Google

4. Initialisez la base de données :
```bash
npx prisma db push
```

5. Démarrez le serveur de développement :
```bash
npm run dev
```

L'application sera disponible à l'adresse [http://localhost:3000](http://localhost:3000).

## Configuration de l'authentification Google

1. Allez sur [Google Cloud Console](https://console.cloud.google.com)
2. Créez un nouveau projet
3. Activez l'API OAuth
4. Configurez l'écran de consentement OAuth
5. Créez des identifiants OAuth 2.0
6. Ajoutez les URIs de redirection autorisés :
   - http://localhost:3000/api/auth/callback/google (développement)
   - https://votre-domaine.com/api/auth/callback/google (production)

## Déploiement

Pour déployer l'application en production :

1. Mettez à jour les variables d'environnement pour la production
2. Construisez l'application :
```bash
npm run build
```

3. Démarrez le serveur de production :
```bash
npm start
```

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.
