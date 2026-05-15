# CLAUDE.md — NodeMap (racine)

## C'est quoi ce projet ?

NodeMap est un graphe de connaissances interactif pour apprendre la tech, concept par concept.
L'apprenant navigue dans un graphe de nœuds : chaque nœud est un concept, relié à ses prérequis et à ce qu'il débloque.

**Docs de référence :**
- `nodemap-vision.md` — vision produit, MVP, roadmap
- `data-schema.md` — structure exacte des données (lire avant de toucher aux données)

---

## Structure du monorepo

```
nodemap/
├── CLAUDE.md                  ← tu es ici
├── docker-compose.yml
├── .env.example
├── frontend/                  ← Vue.js (voir frontend/CLAUDE.md)
│   └── CLAUDE.md
├── backend/                   ← Express + SQLite (voir backend/CLAUDE.md)
│   └── CLAUDE.md
└── content/                   ← JSON des nœuds, technos, thèmes
    ├── themes/
    ├── technologies/
    └── nodes/
```

---

## Stack décidée (ne pas remettre en question)

| Couche | Choix | Remarque |
|---|---|---|
| Frontend | Vue 3 + Vite | Composition API, pas Options API |
| Graphe | Cytoscape.js + layout dagre | Layout hiérarchique orienté |
| État | Pinia | Store officiel Vue 3 |
| Backend | Express (Node.js) | REST API simple |
| Base de données | SQLite (MVP) | Via better-sqlite3 |
| Dev | Docker Compose | 1 commande pour tout lancer |

---

## Règles globales

- Tout le code est en **anglais** (variables, fonctions, commentaires)
- Les textes affichés à l'utilisateur sont en **français**
- Pas de `any` en TypeScript — typer correctement ou ne pas typer du tout
- Pas de dépendances inutiles — justifier chaque nouveau package
- Les IDs des nœuds, technos et thèmes sont toujours en **kebab-case français** (ex: `fonctions-fleches`)

---

## Comment lancer le projet

```bash
docker-compose up --build   # premier lancement
docker-compose up           # lancements suivants
```

- Frontend : http://localhost:5173
- Backend API : http://localhost:3000
- Base de données : SQLite, fichier dans backend/data/nodemap.db
