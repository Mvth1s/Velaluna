# Tests de charge k6

Deux scripts disponibles :

| Script | Description |
|---|---|
| `api.js` | Test de charge sur tous les endpoints — ramp-up 10 VUs sur 2 minutes |
| `scenarios.js` | Scénarios utilisateurs réalistes — 2 profils (explorateur + utilisateur récurrent) |

---

## Prérequis

Le backend doit tourner avant de lancer les tests.

```bash
docker-compose up -d
```

---

## Lancer avec Docker (recommandé, sans installer k6)

```bash
# Test de charge complet
docker run --rm \
  --network velaluna_default \
  -v "$(pwd)/k6:/scripts" \
  -e BASE_URL=http://backend:3000 \
  grafana/k6 run /scripts/api.js

# Scénarios utilisateurs
docker run --rm \
  --network velaluna_default \
  -v "$(pwd)/k6:/scripts" \
  -e BASE_URL=http://backend:3000 \
  grafana/k6 run /scripts/scenarios.js
```

---

## Lancer avec k6 installé

```bash
# Installation sur Arch Linux (AUR)
yay -S k6
# ou
paru -S k6

# Test de charge complet
k6 run k6/api.js

# Scénarios utilisateurs
k6 run k6/scenarios.js

# Cibler une autre URL (staging, prod)
k6 run -e BASE_URL=https://velaluna.up.railway.app k6/api.js
```

---

## Thresholds

Les deux scripts échouent si :
- P95 de la latence dépasse **500ms** (`api.js`) ou **800ms** (`scenarios.js`)
- Le taux d'erreur dépasse **1%**

---

## Voir les résultats dans Grafana

Pour envoyer les métriques k6 vers Prometheus (et les voir dans Grafana) :

```bash
k6 run --out experimental-prometheus-rw k6/api.js
```

Sans cette option, k6 affiche les résultats uniquement dans le terminal.
