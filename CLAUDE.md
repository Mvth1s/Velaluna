# CLAUDE.md — Velaluna (racine)

## C'est quoi ce projet ?

Velaluna est un graphe de connaissances interactif pour apprendre la tech, concept par concept.
L'apprenant navigue dans un graphe de nœuds : chaque nœud est un concept, relié à ses prérequis et à ce qu'il débloque.

**Docs de référence :**
- `velaluna-vision.md` — vision produit, MVP, roadmap
- `velaluna-data-schema.md` — structure exacte des données (lire avant de toucher aux données)

---

## Structure du projet

```
velaluna/
├── CLAUDE.md                      ← tu es ici
├── velaluna-vision.md
├── velaluna-data-schema.md
├── README.md
├── docker-compose.yml
├── .env.example
├── velaluna_logo_dark.png
├── velaluna_logo_light.png
├── velaluna_charter.png
├── frontend/                      ← Vue.js (voir frontend/CLAUDE.md)
│   └── CLAUDE.md
├── backend/                       ← Express + SQLite (voir backend/CLAUDE.md)
│   └── CLAUDE.md
└── content/                       ← JSON des nœuds, technos, thèmes
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

## Architecture multi-agents

Le projet est développé avec une équipe d'agents spécialisés. Chaque agent a un périmètre strict et ne sort pas de son domaine.

### Les agents disponibles

| Agent | Rôle | CLAUDE.md à fournir en contexte |
|---|---|---|
| **Frontend** | Vue.js, Cytoscape.js, UI/UX | `CLAUDE.md` + `frontend/CLAUDE.md` |
| **Backend** | Express, routes API, logique métier | `CLAUDE.md` + `backend/CLAUDE.md` |
| **Base de données** | Schéma SQLite, migrations, seed | `CLAUDE.md` + `backend/CLAUDE.md` + `velaluna-data-schema.md` |
| **DevOps** | Docker, docker-compose, CI/CD, déploiement | `CLAUDE.md` |
| **Contenu** | Génération des nœuds JSON via LLM | `CLAUDE.md` + `velaluna-data-schema.md` |

### Protocole avant chaque session

1. **Définir la tâche** — être précis sur ce qui doit être produit
2. **Choisir l'agent** — selon le domaine de la tâche
3. **Fournir le bon contexte** — donner les CLAUDE.md listés ci-dessus pour cet agent
4. **Créer la branche** — avant de commencer à coder (voir Git ci-dessous)
5. **Valider et merger** — relire, tester, ouvrir une PR vers `develop`

---

## Workflow Git

### Branches

```
main        ← production stable, jamais de commit direct
develop     ← intégration, base de toutes les features
feature/*   ← une branche par fonctionnalité
fix/*       ← corrections de bugs
content/*   ← ajout ou modification de nœuds JSON
devops/*    ← docker, CI/CD, config
```

### Nommage des branches

```bash
feature/graph-interactif
feature/fiche-noeud
feature/progression-localstorage
fix/noeud-verrouille-non-cliquable
content/noeuds-javascript
devops/docker-compose-setup
```

### Commits — format conventionnel

```
type(scope): description courte en français

feat(frontend): ajoute le composant NodeGraph avec Cytoscape
fix(backend): corrige le format de réponse sur GET /nodes/:id
chore(devops): configure docker-compose avec les trois services
content(javascript): ajoute les 8 premiers nœuds JavaScript
docs: met à jour le schéma de données
```

**Types autorisés :** `feat` · `fix` · `chore` · `content` · `docs` · `refactor` · `test`

### Quand commiter ?

- Après chaque fonctionnalité cohérente et fonctionnelle — pas après chaque fichier
- Jamais avec du code cassé
- Avant de changer de contexte (fin de session, changement d'agent)
- Un commit = un message qui a du sens relu 6 mois plus tard

### Règle absolue

```bash
git checkout develop && git pull
git checkout -b feature/ma-feature
# ... coder ...
git add . && git commit -m "feat(scope): description"
git push origin feature/ma-feature
# → ouvrir une PR vers develop
```

---

## Règles globales

- Tout le code est en **anglais** (variables, fonctions, commentaires)
- Les textes affichés à l'utilisateur sont en **français**
- Pas de `any` en TypeScript — typer ou ne pas typer, mais pas de `any`
- Pas de dépendances inutiles — justifier chaque nouveau package
- Les IDs des nœuds, technos et thèmes sont toujours en **kebab-case français** (ex: `fonctions-fleches`)

---

## Lancer le projet

```bash
docker-compose up --build   # premier lancement
docker-compose up           # lancements suivants
```

- Frontend : http://localhost:5173
- Backend API : http://localhost:3000
- Base de données : `backend/data/velaluna.db`
