# CLAUDE.md — Frontend

## Stack

- **Vue 3** avec Vite, Composition API (`<script setup>`)
- **Cytoscape.js** pour le graphe interactif
- **Pinia** pour la gestion d'état
- **Vue Router** pour la navigation
- **TypeScript** (optionnel mais encouragé pour les types de données)

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
│   │   └── nodemap.ts               ← types TypeScript (Node, Tech, Theme…)
│   └── assets/
│       └── logos/                   ← logos des technos (SVG)
```

---

## Conventions Vue

- Toujours `<script setup lang="ts">` en premier dans le SFC
- Props typées avec `defineProps<{...}>()`
- Pas de `this`, pas d'Options API
- Un composant = une responsabilité claire
- Les noms de composants sont en PascalCase

---

## Cytoscape.js — règles importantes

Le graphe est initialisé dans `NodeGraph.vue` via le composable `useCytoscape.ts`.

**Les trois états visuels d'un nœud :**

```js
// Classes Cytoscape appliquées selon la progression
'locked'      // gris, non cliquable — prérequis manquants
'available'   // bleu, cliquable — prérequis complétés
'completed'   // vert, cliquable — validé par l'apprenant
```

**Layout utilisé :** `dagre` (graphe orienté hiérarchique)

```js
cy.layout({
  name: 'dagre',
  rankDir: 'TB',      // top → bottom
  nodeSep: 60,
  rankSep: 80,
  padding: 30
}).run()
```

**Interaction :** un clic sur un nœud `available` ou `completed` ouvre la fiche (panneau latéral ou navigation vers NodeView).
Un clic sur un nœud `locked` affiche un toast "Complète d'abord les prérequis".

---

## Pinia — stores

### progressStore
Responsable de la progression localStorage.

```ts
// Clés importantes
status(techId, nodeId): 'locked' | 'available' | 'in_progress' | 'completed'
completeNode(techId, nodeId, projectId): void
isAvailable(techId, nodeId): boolean  // tous les prérequis complétés ?
```

### contentStore
Responsable du fetch des données depuis l'API backend.

```ts
fetchTechnologies(): Promise<Technology[]>
fetchNodes(techId: string): Promise<Node[]>
getNode(nodeId: string): Node | undefined
```

---

## Types de données

Les types TypeScript reflètent exactement le schéma JSON défini dans `data-schema.md`.
Ne pas inventer de champs supplémentaires sans mettre à jour le schéma.

```ts
// Voir src/types/nodemap.ts pour les types complets
type NodeStatus = 'locked' | 'available' | 'in_progress' | 'completed'
type Difficulty = 'beginner' | 'intermediate' | 'advanced'
```

---

## Ce qu'il ne faut pas faire

- Ne pas appeler l'API directement depuis un composant — passer par les stores
- Ne pas stocker la progression ailleurs que dans `progressStore` (et donc localStorage)
- Ne pas modifier le graphe Cytoscape directement dans un composant — passer par `useCytoscape.ts`
- Ne pas utiliser `v-html` pour afficher le code des exemples — utiliser une lib de coloration syntaxique (ex: Shiki ou highlight.js)
