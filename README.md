# Velaluna

Graphe de connaissances interactif pour apprendre la tech, concept par concept.

Tu choisis un thème → une technologie → tu navigues dans un graphe de nœuds. Chaque nœud est un concept relié à ses prérequis et à ce qu'il débloque. Ta progression est sauvegardée dans le navigateur, sans compte à créer.

---

## Setup de l'environnement

Avant de lancer le projet, configure les variables d'environnement :

```bash
# 1. Copier le template
cp .env.docker.example .env.docker

# 2. Remplir les vraies valeurs dans .env.docker
#    NE PAS commiter ce fichier — il est dans .gitignore
```

| Variable | Description |
|---|---|
| `POSTGRES_USER` | Utilisateur PostgreSQL |
| `POSTGRES_PASSWORD` | Mot de passe PostgreSQL |
| `POSTGRES_DB` | Nom de la base de données |
| `DATABASE_URL` | URL de connexion complète (doit correspondre aux 3 variables ci-dessus) |
| `PGADMIN_DEFAULT_EMAIL` | Email de connexion pgAdmin |
| `PGADMIN_DEFAULT_PASSWORD` | Mot de passe pgAdmin |
| `GF_SECURITY_ADMIN_PASSWORD` | Mot de passe admin Grafana |

```bash
# 3. Lancer avec le fichier de variables
docker-compose --env-file .env.docker up --build
```

---

## Lancer le projet

```bash
# Tout lancer en une commande (recommandé)
docker-compose --env-file .env.docker up --build   # premier lancement
docker-compose --env-file .env.docker up           # suivants

# Frontend seul
cd frontend && npm install && npm run dev

# Backend seul (DATABASE_URL doit être définie dans l'environnement)
cd backend && npm install && npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| pgAdmin | http://localhost:5050 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3001 |

Voir `assets/services-locaux.md` pour les credentials de chaque service.

---

## Stack

| Couche | Technologie |
|---|---|
| Frontend | Vue 3 + Vite, Composition API |
| Graphe | Cytoscape.js + layout dagre |
| État | Pinia |
| Backend | Express (Node.js), REST GET-only |
| Base de données | PostgreSQL via pg (node-postgres) |
| Observabilité | Prometheus + Grafana + prom-client |
| Dev | Docker Compose |
| Production | Railway (monolithe Express servant le SPA Vue) |

---

## Structure du projet

```
Velaluna/
├── frontend/          ← Vue 3 + Vite
├── backend/           ← Express + PostgreSQL
├── content/           ← données source en JSON (themes, technologies, nodes)
│   ├── themes/
│   ├── technologies/
│   └── nodes/         ← fichiers plats, un JSON par nœud
├── k6/                ← scripts de tests de charge
├── prometheus/        ← config de scraping Prometheus
├── grafana/           ← provisioning Grafana (datasources + dashboards)
├── assets/            ← documentation produit et schéma des données
├── .github/workflows/ ← pipelines CI/CD GitHub Actions
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

Le contenu est stocké en JSON dans `/content` et chargé en PostgreSQL au démarrage si la base est vide.

1. Ajouter le fichier JSON dans `content/nodes/` (voir `assets/velaluna-data-schema.md` pour le schéma exact)
2. Référencer le nœud dans `content/technologies/<id>.json`
3. Relancer le seed : `cd backend && npm run seed`

---

## Tests de charge (k6)

```bash
# Avec Docker (recommandé)
docker run --rm \
  --network velaluna_default \
  -v "$(pwd)/k6:/scripts" \
  -e BASE_URL=http://backend:3000 \
  grafana/k6 run /scripts/api.js
```

Voir `k6/README.md` pour tous les scripts et options.

---

## Déploiement

Le projet tourne sur Railway. Le `Dockerfile` à la racine fait un build multi-stage :

1. Build du frontend Vue → fichiers statiques
2. Build du backend TypeScript
3. Image de production : Express sert l'API sur `/api/*` et les fichiers Vue sur `/*`

La base PostgreSQL est fournie par le plugin Railway. La variable `DATABASE_URL` est injectée automatiquement. Le seed s'exécute au démarrage si la base est vide.

---

## CI/CD

| Workflow | Déclencheur | Action |
|---|---|---|
| `ci.yml` | PR vers `dev` ou `main` | TypeScript check + build frontend |
| `release.yml` | Push sur `main` | Semantic release → tag + CHANGELOG + GitHub Release |

Les messages de commit sont validés localement par Husky + commitlint (format Conventional Commits).

---

## Documentation

- `assets/velaluna-vision.md` — vision produit, roadmap
- `assets/velaluna-data-schema.md` — schéma des données (lire avant de toucher au contenu)
- `assets/services-locaux.md` — accès et credentials des services Docker (pgAdmin, Grafana, Prometheus)
- `CLAUDE.md` — guide pour les agents IA (Claude Code)
- `frontend/CLAUDE.md` — contexte frontend
- `backend/CLAUDE.md` — contexte backend
