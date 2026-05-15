# CLAUDE.md — Backend

## Stack

- **Express** (Node.js) — API REST
- **better-sqlite3** — SQLite synchrone, zéro config
- **TypeScript** — fortement encouragé

---

## Structure des dossiers

```
backend/
├── src/
│   ├── routes/
│   │   ├── themes.ts            ← GET /themes
│   │   ├── technologies.ts      ← GET /technologies, GET /technologies/:id
│   │   └── nodes.ts             ← GET /nodes/:id, GET /technologies/:id/nodes
│   ├── controllers/
│   │   ├── themesController.ts
│   │   ├── technologiesController.ts
│   │   └── nodesController.ts
│   ├── db/
│   │   ├── database.ts          ← connexion SQLite (singleton)
│   │   └── seed.ts              ← peuple la DB depuis /content (JSON)
│   └── app.ts                   ← setup Express, middlewares, routes
├── data/
│   └── nodemap.db               ← fichier SQLite (gitignore)
└── package.json
```

---

## API — Routes disponibles

Toutes les routes sont en lecture seule (GET). Pas d'écriture via l'API — la progression est gérée côté client en localStorage.

```
GET /themes                        → liste tous les thèmes
GET /technologies                  → liste toutes les technos
GET /technologies/:id              → détail d'une techno (avec ses node IDs)
GET /technologies/:id/nodes        → tous les nœuds d'une techno
GET /nodes/:id                     → détail complet d'un nœud
```

**Format de réponse standard :**
```json
{
  "data": { ... },
  "error": null
}
```

**En cas d'erreur :**
```json
{
  "data": null,
  "error": "Node not found"
}
```

---

## Base de données SQLite

### Schéma des tables

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
  data JSON NOT NULL   -- tout le contenu du nœud stocké en JSON
);

CREATE TABLE technology_nodes (
  technology_id TEXT NOT NULL,
  node_id TEXT NOT NULL,
  position INTEGER,    -- ordre dans le graphe
  PRIMARY KEY (technology_id, node_id),
  FOREIGN KEY (technology_id) REFERENCES technologies(id),
  FOREIGN KEY (node_id) REFERENCES nodes(id)
);
```

Le contenu complet du nœud (explanation, analogy, example, projects, prerequisites, unlocks) est stocké dans la colonne `data` en JSON. Ça évite une prolifération de tables pour le MVP.

### Seeding

Le script `db/seed.ts` lit les fichiers JSON dans `/content` et les insère en base.
À relancer à chaque ajout de contenu :

```bash
npm run seed
```

---

## Conventions Express

- Un fichier de routes par entité (themes, technologies, nodes)
- Les controllers contiennent la logique, les routes font juste le câblage
- Les erreurs sont catchées et retournées avec le format standard
- CORS activé pour `http://localhost:5173` (frontend dev)
- Pas d'authentification au stade MVP

---

## Ce qu'il ne faut pas faire

- Ne pas écrire de logique SQL dans les routes — tout passe par les controllers
- Ne pas exposer d'endpoints d'écriture (POST/PUT/DELETE) au MVP — la DB est en lecture seule depuis l'API
- Ne pas stocker la progression utilisateur côté backend — c'est le localStorage qui gère ça
- Ne pas utiliser un ORM (Prisma, Sequelize) pour le MVP — better-sqlite3 suffit et est plus simple à déboguer
