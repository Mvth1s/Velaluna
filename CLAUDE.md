# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Qu'est-ce que Velaluna ?

Graphe de connaissances interactif pour apprendre la tech, concept par concept.
L'apprenant choisit un thème → une technologie → navigue dans un graphe de nœuds.
Chaque nœud est un concept relié à ses prérequis et à ce qu'il débloque.

**Docs de référence :**
- `assets/velaluna-vision.md` — vision produit, MVP, roadmap
- `assets/velaluna-data-schema.md` — structure exacte des données (lire avant de toucher aux données)

---

## Stack (ne pas remettre en question)

| Couche | Choix |
|---|---|
| Frontend | Vue 3 + Vite, Composition API (`<script setup lang="ts">`) |
| Graphe | Cytoscape.js + layout dagre |
| État | Pinia |
| Backend | Express (Node.js), REST GET-only |
| Base de données | SQLite via better-sqlite3 |
| Dev | Docker Compose |
| Production | Railway — monolithe Express servant le SPA Vue |

---

## Lancer le projet

```bash
# Tout lancer (recommandé)
docker-compose up --build   # premier lancement
docker-compose up           # suivants

# Frontend seul (dans frontend/)
npm install && npm run dev

# Backend seul (dans backend/)
npm install && npm run dev
npm run seed                # peupler la DB depuis /content (JSON → SQLite)
```

- Frontend : http://localhost:5173
- Backend API : http://localhost:3000
- Base de données : `backend/data/velaluna.db` (gitignored)

---

## Architecture des données

Hiérarchie des entités : `Theme → Technology → Node`
- Un nœud peut appartenir à plusieurs technos (relation many-to-many via `technology_nodes`)
- Le contenu statique est stocké en SQLite (chargé depuis `/content` via `npm run seed`)
- La progression utilisateur est stockée **uniquement en localStorage** (pas d'écriture via l'API au MVP)

**API — routes disponibles (GET uniquement, préfixe `/api`) :**
```
GET /api/themes
GET /api/technologies
GET /api/technologies/:id
GET /api/technologies/:id/nodes
GET /api/nodes/:id
```

Format de réponse : `{ "data": {...}, "error": null }` ou `{ "data": null, "error": "message" }`

En production, Express sert aussi le SPA Vue : `GET /*` → `index.html`

**États visuels d'un nœud (Cytoscape) :**
```
locked      → gris, non cliquable (prérequis manquants)
available   → bleu, cliquable (tous les prérequis complétés)
completed   → vert, cliquable (validé par l'apprenant)
```

Un nœud est `available` uniquement si **tous** ses prérequis sont `completed`.
Un nœud sans prérequis est `available` dès le départ.

---

## Règles globales

- Tout le code est en **anglais** (variables, fonctions, commentaires)
- Les textes affichés à l'utilisateur sont en **français**
- Les IDs des nœuds, technos et thèmes sont en **kebab-case français** (ex: `fonctions-fleches`)
- Pas de `any` en TypeScript
- Pas de dépendances inutiles — justifier chaque nouveau package

---

## Agents spécialisés — contexte requis

| Tâche | CLAUDE.md à charger |
|---|---|
| Frontend (Vue, Cytoscape, UI) | `CLAUDE.md` + `frontend/CLAUDE.md` |
| Backend (Express, routes) | `CLAUDE.md` + `backend/CLAUDE.md` |
| Base de données (schéma, seed) | `CLAUDE.md` + `backend/CLAUDE.md` + `assets/velaluna-data-schema.md` |
| Contenu (génération JSON nœuds) | `CLAUDE.md` + `assets/velaluna-data-schema.md` |
| DevOps (Docker, Railway) | `CLAUDE.md` |

---

## Workflow Git

```
main        ← production stable, jamais de commit direct
dev         ← base de toutes les features (branch depuis ici)
feature/*   ← fonctionnalités
fix/*       ← corrections
content/*   ← ajout/modification de nœuds JSON
devops/*    ← docker, CI/CD, config
docs/*      ← documentation
```

**Format des commits :**
```
feat(frontend): ajoute le composant NodeGraph avec Cytoscape
fix(backend): corrige le format de réponse sur GET /api/nodes/:id
content(javascript): ajoute les 8 premiers nœuds JavaScript
docs: met à jour velaluna-vision et README
```

Types : `feat` · `fix` · `chore` · `content` · `docs` · `refactor` · `test`

Toujours brancher depuis `dev` et ouvrir une PR vers `dev`.
