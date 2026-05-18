# Velaluna

Graphe de connaissances interactif pour apprendre la tech, concept par concept.

Tu choisis un thème → une technologie → tu navigues dans un graphe de nœuds. Chaque nœud est un concept relié à ses prérequis et à ce qu'il débloque. Ta progression est sauvegardée dans le navigateur, sans compte à créer.

---

## Lancer le projet

```bash
# Tout lancer en une commande (recommandé)
docker-compose up --build   # premier lancement
docker-compose up           # suivants

# Frontend seul
cd frontend && npm install && npm run dev

# Backend seul
cd backend && npm install && npm run dev
npm run seed                # (re)peupler la DB depuis /content
```

- Frontend : http://localhost:5173
- Backend API : http://localhost:3000

---

## Stack

| Couche | Technologie |
|---|---|
| Frontend | Vue 3 + Vite, Composition API |
| Graphe | Cytoscape.js + layout dagre |
| État | Pinia |
| Backend | Express (Node.js), REST GET-only |
| Base de données | SQLite via better-sqlite3 |
| Dev | Docker Compose |
| Production | Railway (monolithe Express servant le SPA Vue) |

---

## Structure du projet

```
Velaluna/
├── frontend/          ← Vue 3 + Vite
├── backend/           ← Express + SQLite
├── content/           ← données source en JSON (themes, technologies, nodes)
│   ├── themes/
│   ├── technologies/
│   └── nodes/         ← fichiers plats, un JSON par nœud
├── assets/            ← documentation produit et schéma des données
├── Dockerfile         ← build multi-stage (frontend → backend → prod)
├── railway.toml       ← config déploiement Railway
└── docker-compose.yml ← environnement de développement local
```

---

## Contenu actuel

| Thème | Technologie | Nœuds |
|---|---|---|
| Web | HTML/CSS | 8 |
| Web | JavaScript | 8 |
| Web | TypeScript | 8 |
| Scripting | Bash | 8 |
| Scripting | Python | 8 |
| Scripting | Git | 10 |
| Langages | Java | 10 |
| Langages | C | 10 |

---

## Ajouter du contenu

Le contenu est stocké en JSON dans `/content` et chargé en SQLite au build.

1. Ajouter le fichier JSON dans `content/nodes/` (voir `assets/velaluna-data-schema.md` pour le schéma exact)
2. Référencer le nœud dans `content/technologies/<id>.json`
3. Relancer le seed : `cd backend && npm run seed`

---

## Déploiement

Le projet tourne sur Railway. Le `Dockerfile` à la racine fait un build multi-stage :

1. Build du frontend Vue → fichiers statiques
2. Build du backend + seed SQLite
3. Image de production : Express sert l'API sur `/api/*` et les fichiers Vue sur `/*`

La base de données est seedée au build — pas de volume persistant nécessaire (API en lecture seule au MVP).

---

## Documentation

- `assets/velaluna-vision.md` — vision produit, roadmap
- `assets/velaluna-data-schema.md` — schéma des données (lire avant de toucher au contenu)
- `CLAUDE.md` — guide pour les agents IA (Claude Code)
- `frontend/CLAUDE.md` — contexte frontend
- `backend/CLAUDE.md` — contexte backend
