```markdown
# 📚 BookManagement

## ⚙️ Configuration du projet

### 1. Initialisation du projet Node.js

```bash
npm init
```

### 2. Fichiers de configuration

- Crée un fichier `.gitignore`
- Structure suggérée :
  ```
  backend/
    └── server.js
  ```

### 3. Installation des dépendances

#### Dépendances principales :

```bash
npm install express dotenv mongoose colors
```

#### Dépendances de développement :

```bash
npm install -D nodemon
```

### 4. Configuration des scripts dans `package.json`

```json
"scripts": {
  "start": "node backend/server.js",
  "server": "nodemon backend/server.js"
}
```

### 5. Lancer le serveur

```bash
npm run server
```

---

## 🔐 Authentification

```bash
npm install bcryptjs jsonwebtoken
```
```

