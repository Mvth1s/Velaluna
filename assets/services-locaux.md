# Services locaux — Accès et credentials

> Ce document liste les services disponibles dans l'environnement de développement local (Docker Compose).
> Ces credentials sont uniquement pour le dev local — ne jamais les utiliser en production.

Lancer l'environnement :
```bash
docker-compose up --build   # premier lancement
docker-compose up           # suivants
```

---

## PostgreSQL

Base de données principale de Velaluna.

| Paramètre | Valeur |
|---|---|
| Host | `localhost` |
| Port | `5432` |
| Database | `velaluna` |
| Utilisateur | `velaluna` |
| Mot de passe | `velaluna` |
| URL complète | `postgresql://velaluna:velaluna@localhost:5432/velaluna` |

Connexion via psql :
```bash
psql postgresql://velaluna:velaluna@localhost:5432/velaluna
```

---

## pgAdmin

Interface graphique d'administration PostgreSQL.

| Paramètre | Valeur |
|---|---|
| URL | http://localhost:5050 |
| Email | `admin@velaluna.dev` |
| Mot de passe | `admin` |

### Connecter pgAdmin à PostgreSQL

Au premier accès :
1. Ouvrir http://localhost:5050 et se connecter avec `admin@velaluna.dev` / `admin`
2. Clic droit sur **Servers** → **Register** → **Server...**
3. Onglet **General** : Name = `Velaluna Local`
4. Onglet **Connection** :
   - Host : `postgres` *(nom du service Docker, pas localhost)*
   - Port : `5432`
   - Maintenance database : `velaluna`
   - Username : `velaluna`
   - Password : `velaluna`
5. **Save** → la base apparaît dans l'arborescence

---

## Prometheus

Collecte des métriques de l'API Express.

| Paramètre | Valeur |
|---|---|
| URL | http://localhost:9090 |
| Authentification | aucune |
| Cible scrapée | `backend:3000/metrics` |

### Vérifier que le scraping fonctionne

1. Ouvrir http://localhost:9090/targets
2. Le job `velaluna-api` doit être en statut **UP**

### Requêtes utiles

```promql
# Requêtes par seconde
rate(http_requests_total[2m])

# Latence p95
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[2m]))

# Taux d'erreur 5xx
rate(http_requests_total{status=~"5.."}[2m]) / rate(http_requests_total[2m])

# Mémoire Node.js
nodejs_heap_size_used_bytes
```

---

## Grafana

Dashboards de monitoring de l'API.

| Paramètre | Valeur |
|---|---|
| URL | http://localhost:3001 |
| Utilisateur | `admin` |
| Mot de passe | `admin` |

### Dashboard Velaluna API

Le dashboard est auto-provisionné au démarrage de Grafana :

1. Ouvrir http://localhost:3001
2. Se connecter avec `admin` / `admin`
3. Menu **Dashboards** → dossier **Velaluna** → **Velaluna API**

Le dashboard affiche :
- Requêtes / seconde par route
- Latence p50 / p95 / p99
- Taux d'erreur 5xx
- Mémoire heap Node.js

Rafraîchissement automatique toutes les 10 secondes.

### Datasource Prometheus

La datasource Prometheus est auto-provisionnée. Pour la vérifier :
**Administration** → **Data sources** → **Prometheus** → l'URL doit être `http://prometheus:9090`.
