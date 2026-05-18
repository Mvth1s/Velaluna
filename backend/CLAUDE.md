# CLAUDE.md — Backend

## Contexte agent

Tu travailles uniquement dans le dossier `backend/`.
Tu ne touches pas au frontend ni à la config Docker.
Avant chaque session : crée une branche depuis `dev`.

---

## Stack

- **Express** (Node.js) — API REST en lecture seule
- **better-sqlite3** — SQLite synchrone, zéro config
- **TypeScript** — obligatoire

---

## Structure des dossiers

```
backend/
├── src/
│   ├── routes/
│   │   ├── themes.ts              ← GET /api/themes
│   │   ├── technologies.ts        ← GET /api/technologies, /api/technologies/:id
│   │   └── nodes.ts               ← GET /api/nodes/:id, /api/technologies/:id/nodes
│   ├── controllers/
│   │   ├── themesController.ts
│   │   ├── technologiesController.ts
│   │   └── nodesController.ts
│   ├── db/
│   │   ├── database.ts            ← connexion SQLite (singleton)
│   │   └── seed.ts                ← peuple la DB depuis /content (JSON)
│   └── app.ts                     ← setup Express, middlewares, routes, SPA fallback
├── data/
│   └── velaluna.db                ← fichier SQLite (gitignore)
└── package.json
```

---

## API — Routes disponibles

Toutes les routes sont **en lecture seule** (GET uniquement) et préfixées `/api`.
La progression utilisateur est gérée côté client en localStorage — pas d'écriture via l'API au MVP.

```
GET /api/themes                        → liste tous les thèmes
GET /api/technologies                  → liste toutes les technos
GET /api/technologies/:id              → détail d'une techno (avec ses node IDs)
GET /api/technologies/:id/nodes        → tous les nœuds d'une techno
GET /api/nodes/:id                     → détail complet d'un nœud
```

**Format de réponse standard :**
```json
{ "data": { ... }, "error": null }
```

**En cas d'erreur :**
```json
{ "data": null, "error": "Node not found" }
```

---

## Serveur en production

En production (NODE_ENV=production), Express sert aussi les fichiers statiques du SPA Vue :

```ts
const publicDir = path.join(__dirname, '../public')
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'))
  })
}
```

Le frontend Vue est copié dans `backend/public/` au build Docker (voir `Dockerfile` à la racine).

---

## Schéma SQLite

```sql
CREATE TABLE themes (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT,
  icon TEXT
);

CREATE TABLE technologies (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  theme_id TEXT NOT NULL,
  description TEXT,
  logo TEXT,
  FOREIGN KEY (theme_id) REFERENCES themes(id)
);

CREATE TABLE nodes (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  data JSON NOT NULL   -- contenu complet du nœud (explanation, analogy, example, projects…)
);

CREATE TABLE technology_nodes (
  technology_id TEXT NOT NULL,
  node_id TEXT NOT NULL,
  position INTEGER,
  PRIMARY KEY (technology_id, node_id),
  FOREIGN KEY (technology_id) REFERENCES technologies(id),
  FOREIGN KEY (node_id) REFERENCES nodes(id)
);
```

Le contenu complet du nœud est stocké en JSON dans `data`. Évite une prolifération de tables pour le MVP.

### Seeding

Le script `db/seed.ts` lit les fichiers JSON dans `/content` et insère en base.

```bash
npm run seed   # à relancer à chaque ajout de contenu
```

En production, le seed est exécuté au moment du build Docker — pas à l'exécution.

---

## Conventions Express

- Un fichier de routes par entité
- Les controllers contiennent la logique, les routes font le câblage
- Les erreurs sont catchées et retournées avec le format standard
- CORS configuré via `FRONTEND_URL` (env var) — fallback `http://localhost:5173` en dev
- Pas d'authentification au MVP

---

## Variables d'environnement

| Variable | Défaut | Description |
|---|---|---|
| `PORT` | `3000` | Port d'écoute du serveur |
| `FRONTEND_URL` | `http://localhost:5173` | Origine autorisée par CORS |
| `CONTENT_PATH` | `/content` | Chemin vers les JSON source (pour le seed) |
| `NODE_ENV` | — | `production` active le serving du SPA Vue |

---

## Règles

- Pas de logique SQL dans les routes — tout passe par les controllers
- Pas d'endpoints d'écriture (POST/PUT/DELETE) au MVP
- Pas d'ORM (Prisma, Sequelize) — better-sqlite3 suffit et est plus simple à déboguer
- Pas de `any` en TypeScript

---

## Git

```bash
git checkout dev && git pull
git checkout -b feature/nom-de-la-feature   # ou fix/ ou devops/
# ... coder ...
git commit -m "feat(backend): description"
git push origin feature/nom-de-la-feature
# → ouvrir une PR vers dev
```
