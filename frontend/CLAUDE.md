# CLAUDE.md — Frontend (agent Frontend)

## Contexte agent

Tu es l'agent Frontend de Velaluna. Tu travailles uniquement dans le dossier `frontend/`.
Tu ne touches pas au backend, à la base de données, ni à la config Docker.
Avant chaque session : crée une branche `feature/` depuis `develop`.

---

## Stack

- **Vue 3** avec Vite, Composition API (`<script setup>`)
- **Cytoscape.js** pour le graphe interactif
- **Pinia** pour la gestion d'état
- **Vue Router** pour la navigation
- **TypeScript** (obligatoire pour les types de données)

---

## Structure des dossiers

```
frontend/
├── src/
│   ├── components/
│   │   ├── graph/
│   │   │   ├── NodeGraph.vue        ← le graphe Cytoscape
│   │   │   └── GraphLegend.vue      ← légende des états
│   │   └── node/
│   │       ├── NodeCard.vue         ← fiche d'un nœud (panneau latéral)
│   │       ├── NodeExample.vue      ← bloc de code + explication
│   │       └── NodeProject.vue      ← mini-projet
│   ├── views/
│   │   ├── HomeView.vue             ← choix du thème
│   │   ├── TechnologyView.vue       ← graphe d'une techno
│   │   └── NodeView.vue             ← fiche complète d'un nœud
│   ├── stores/
│   │   ├── progressStore.ts         ← progression localStorage
│   │   └── contentStore.ts          ← données nœuds/technos (fetch API)
│   ├── composables/
│   │   └── useCytoscape.ts          ← logique Cytoscape réutilisable
│   ├── types/
│   │   └── velaluna.ts              ← types TypeScript (Node, Tech, Theme…)
│   └── assets/
│       └── logos/                   ← logos des technos (SVG)
```

---

## Conventions Vue

- Toujours `<script setup lang="ts">` en premier dans le SFC
- Props typées avec `defineProps<{...}>()`
- Pas de `this`, pas d'Options API
- Un composant = une responsabilité claire
- Noms de composants en PascalCase

---

## Cytoscape.js — règles importantes

Le graphe est initialisé dans `NodeGraph.vue` via le composable `useCytoscape.ts`.

**Les trois états visuels d'un nœud :**

```js
'locked'      // gris, non cliquable — prérequis manquants
'available'   // bleu, cliquable — prérequis complétés
'completed'   // vert, cliquable — validé par l'apprenant
```

**Layout utilisé :** `dagre` (graphe orienté hiérarchique)

```js
cy.layout({
  name: 'dagre',
  rankDir: 'TB',   // top → bottom
  nodeSep: 60,
  rankSep: 80,
  padding: 30
}).run()
```

**Interactions :**
- Clic sur `available` ou `completed` → ouvre la fiche du nœud
- Clic sur `locked` → toast "Complète d'abord les prérequis"

---

## Pinia — stores

### progressStore
Gère la progression en localStorage.

```ts
status(techId, nodeId): 'locked' | 'available' | 'in_progress' | 'completed'
completeNode(techId, nodeId, projectId): void
isAvailable(techId, nodeId): boolean  // tous les prérequis complétés ?
```

### contentStore
Gère le fetch des données depuis le backend.

```ts
fetchTechnologies(): Promise<Technology[]>
fetchNodes(techId: string): Promise<Node[]>
getNode(nodeId: string): Node | undefined
```

---

## Types TypeScript

Les types reflètent exactement le schéma dans `velaluna-data-schema.md`. Ne pas inventer de champs sans mettre à jour le schéma.

```ts
type NodeStatus = 'locked' | 'available' | 'in_progress' | 'completed'
type Difficulty = 'beginner' | 'intermediate' | 'advanced'
```

---

## Règles

- Ne pas appeler l'API directement depuis un composant — passer par les stores
- Ne pas stocker la progression ailleurs que dans `progressStore`
- Ne pas modifier le graphe Cytoscape dans un composant — passer par `useCytoscape.ts`
- Ne pas utiliser `v-html` pour le code des exemples — utiliser Shiki ou highlight.js
- Ne pas utiliser `any` en TypeScript

## Git

```bash
git checkout develop && git pull
git checkout -b feature/nom-de-la-feature
# ... coder ...
git commit -m "feat(frontend): description"
git push origin feature/nom-de-la-feature
```
