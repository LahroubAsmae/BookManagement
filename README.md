# BookManagement – Application MERN de Gestion des Emprunts de Livres

Une application mobile full-stack permettant aux utilisateurs d’emprunter des livres, et aux administrateurs de gérer la bibliothèque (livres, utilisateurs, emprunts).  
Développée avec la stack **MERN** : MongoDB, Express.js, React Native, Node.js.

---

## Fonctionnalités

###  Utilisateur
- Inscription / Connexion sécurisée (JWT)
- Liste des livres disponibles
- Emprunt d’un livre
- Retour d’un livre
- Historique personnel des emprunts

### 🛠 Administrateur
- Gestion des utilisateurs (affichage, suppression)
- Gestion des livres (ajout, modification, suppression)
- Suivi global des emprunts
- Retour manuel des livres

---

## Technologies utilisées

###  Backend
- **Node.js** : environnement d’exécution côté serveur
- **Express.js** : framework minimaliste pour créer des API
- **MongoDB** : base de données NoSQL
- **Mongoose** : ODM pour interagir avec MongoDB
- **JWT** : authentification sécurisée
- **bcryptjs** : hachage des mots de passe

###  Frontend (mobile)
- **React Native** : développement mobile multiplateforme
- **Expo** : outil de développement pour React Native
- **React Navigation** : navigation entre écrans
- **AsyncStorage** : stockage local des tokens
- **Context API** : gestion d’état global (utilisateur)
