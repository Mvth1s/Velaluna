# CLAUDE.md — Frontend

## Contexte agent

Tu travailles uniquement dans le dossier `frontend/`.
Tu ne touches pas au backend, à la base de données, ni à la config Docker.
Avant chaque session : crée une branche depuis `dev`.

---

## Stack

- **Vue 3** avec Vite, Composition API (`<script setup lang="ts">`)
- **Cytoscape.js** pour le graphe interactif
- **Pinia** pour la gestion d'état
- **Vue Router** pour la navigation
- **TypeScript** obligatoire

---

## Structure des dossiers

```
frontend/
├── public/
│   └── logos/                       ← logos SVG des technos (servis statiquement)
│       ├── javascript.svg
│       ├── typescript.svg
│       ├── html-css.svg
│       ├── python.svg
│       ├── bash.svg
│       ├── git.svg
│       ├── java.svg
│       └── c.svg
└── src/
    ├── components/
    │   ├── graph/
    │   │   ├── NodeGraph.vue        ← le graphe Cytoscape
    │   │   └── GraphLegend.vue      ← légende des états
    │   ├── node/
    │   │   ├── NodeCard.vue         ← fiche d'un nœud (panneau latéral)
    │   │   ├── NodeExample.vue      ← bloc de code + explication
    │   │   └── NodeProject.vue      ← mini-projet
    │   ├── SearchOverlay.vue        ← recherche globale (Cmd/Ctrl+K)
    │   ├── CelebrationBurst.vue     ← animation de validation d'un nœud
    │   └── StarField.vue            ← fond étoilé animé
    ├── views/
    │   ├── HomeView.vue             ← page d'accueil avec stats
    │   ├── ThemesView.vue           ← liste de tous les thèmes
    │   ├── ThemeView.vue            ← technos d'un thème
    │   ├── TechnologyView.vue       ← graphe d'une techno
    │   ├── NodeView.vue             ← fiche complète d'un nœud
    │   └── ProgressView.vue         ← progression globale (stats par thème/techno)
    ├── stores/
    │   ├── progressStore.ts         ← progression localStorage
    │   └── contentStore.ts          ← données nœuds/technos (fetch API)
    ├── composables/
    │   ├── useCytoscape.ts          ← logique Cytoscape réutilisable
    │   └── useHighlighter.ts        ← coloration syntaxique des snippets
    ├── types/
    │   └── velaluna.ts              ← types TypeScript (Node, Tech, Theme…)
    └── assets/
        └── logos/                   ← logo Velaluna (banner, square)
```

---

## Routes (Vue Router)

```
/                          → HomeView
/themes                    → ThemesView
/themes/:themeId           → ThemeView
/themes/:themeId/:techId   → TechnologyView
/node/:id                  → NodeView
/progress                  → ProgressView
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
isAvailable(techId, nodeId): boolean
getCompletedCountForTech(techId): number
resetAll(): void
```

### contentStore
Gère le fetch des données depuis le backend (`/api/*`).

```ts
fetchThemes(): Promise<Theme[]>
fetchTechnologies(): Promise<Technology[]>
fetchNodes(techId: string): Promise<Node[]>
getNode(nodeId: string): Node | undefined
```

---

## Types TypeScript

Les types reflètent exactement le schéma dans `assets/velaluna-data-schema.md`. Ne pas inventer de champs sans mettre à jour le schéma.

```ts
type NodeStatus = 'locked' | 'available' | 'in_progress' | 'completed'
type Difficulty = 'beginner' | 'intermediate' | 'advanced'
```

---

## Design tokens (CSS custom properties)

Les variables CSS sont définies dans `src/style.css` :

```css
--color-ivory        /* texte principal */
--color-stellar      /* accent bleu-vert */
--color-deep         /* fond sombre */
--font-display       /* titres */
--font-ui            /* interface */
--font-label         /* labels, badges */
--border             /* bordures subtiles */
--border-strong      /* bordures accentuées */
--surface-2          /* fond de carte */
--text-mute          /* texte secondaire */
```

---

## Règles

- Ne pas appeler l'API directement depuis un composant — passer par les stores
- Ne pas stocker la progression ailleurs que dans `progressStore`
- Ne pas modifier le graphe Cytoscape dans un composant — passer par `useCytoscape.ts`
- Ne pas utiliser `v-html` pour le code des exemples — utiliser `useHighlighter.ts`
- Ne pas utiliser `any` en TypeScript
- Les logos des technos sont dans `public/logos/` et accessibles via `/logos/<nom>.svg`

---

## Git

```bash
git checkout dev && git pull
git checkout -b feature/nom-de-la-feature
# ... coder ...
git commit -m "feat(frontend): description"
git push origin feature/nom-de-la-feature
# → ouvrir une PR vers dev
```
