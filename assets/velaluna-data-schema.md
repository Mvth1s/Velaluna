# Velaluna — Schéma des données

> Ce document définit la structure exacte des données utilisées par Velaluna.
> Il sert de référence pour le backend, le frontend, et la génération de contenu LLM.
> **Lire ce document avant de toucher aux données ou de générer du contenu.**

---

## Vue d'ensemble

Trois entités principales :

```
Theme → Technology → Node
              ↑          ↑
        (1 techno)  (partageable entre plusieurs technos)
```

Un **nœud** peut appartenir à plusieurs technologies (ex: le concept "variables" existe en JavaScript et en Python). La relation entre nœuds et technos est donc **many-to-many**.

---

## 1. Schéma : Theme

```json
{
  "id": "web",
  "label": "Web",
  "description": "Tout ce qui touche au développement web : structure, style, comportement.",
  "icon": "globe",
  "technologies": ["html-css", "javascript"]
}
```

| Champ | Type | Description |
|---|---|---|
| `id` | string | Identifiant unique, kebab-case français |
| `label` | string | Nom affiché dans l'UI |
| `description` | string | Une phrase de présentation |
| `icon` | string | Nom d'icône Lucide |
| `technologies` | string[] | IDs des technos appartenant à ce thème |

---

## 2. Schéma : Technology

```json
{
  "id": "javascript",
  "label": "JavaScript",
  "theme_id": "web",
  "description": "Le langage de programmation du web, qui permet de rendre les pages interactives.",
  "logo": "javascript.svg",
  "nodes": ["variables", "types-de-donnees", "fonctions", "dom-manipulation"]
}
```

| Champ | Type | Description |
|---|---|---|
| `id` | string | Identifiant unique, kebab-case français |
| `label` | string | Nom affiché dans l'UI |
| `theme_id` | string | ID du thème parent |
| `description` | string | Une phrase de présentation |
| `logo` | string | Nom du fichier logo |
| `nodes` | string[] | IDs des nœuds qui composent le graphe de cette techno |

---

## 3. Schéma : Node

C'est l'entité centrale. Voici la structure complète :

```json
{
  "id": "fonctions",
  "label": "Fonctions",
  "difficulty": "beginner",
  "technologies": ["javascript", "python"],

  "explanation": "Une fonction, c'est un bloc de code qu'on écrit une fois et qu'on peut réutiliser autant de fois qu'on veut. C'est comme une recette de cuisine : tu écris les étapes une seule fois, et tu peux la suivre chaque fois que tu veux faire le plat.",

  "analogy": "Imagine un distributeur automatique. Tu appuies sur un bouton (tu appelles la fonction), et il te donne toujours le même résultat. Tu n'as pas besoin de savoir comment il fonctionne à l'intérieur.",

  "example": {
    "language": "javascript",
    "code": "function direBonjour(prenom) {\n  return 'Bonjour, ' + prenom + ' !';\n}\n\nconsole.log(direBonjour('Alice')); // 'Bonjour, Alice !'\nconsole.log(direBonjour('Bob'));   // 'Bonjour, Bob !'",
    "explanation": "On définit la fonction une seule fois, et on l'appelle deux fois avec des prénoms différents. Le code à l'intérieur s'exécute à chaque appel."
  },

  "prerequisites": ["variables", "types-de-donnees"],
  "unlocks": ["portee-des-variables", "fonctions-fleches", "recursivite"],

  "projects": [
    {
      "id": "calculatrice-basique",
      "label": "Mini-calculatrice",
      "difficulty": "beginner",
      "description": "Crée 4 fonctions : addition, soustraction, multiplication, division. Chacune prend deux nombres et retourne le résultat. Teste-les dans la console.",
      "hint": "Commence par la fonction addition, puis copie-la et adapte-la pour les autres opérations."
    },
    {
      "id": "generateur-messages",
      "label": "Générateur de messages personnalisés",
      "difficulty": "intermediate",
      "description": "Crée une fonction qui génère un message d'accueil différent selon l'heure de la journée (matin, après-midi, soir). Elle prend un prénom et l'heure en paramètre.",
      "hint": "Utilise un if/else pour vérifier l'heure. Tu auras besoin de connaître les conditions — vérifie que tu as validé ce nœud avant."
    }
  ]
}
```

### Détail des champs

| Champ | Type | Description |
|---|---|---|
| `id` | string | Identifiant unique, kebab-case français |
| `label` | string | Nom affiché dans le graphe |
| `difficulty` | enum | `"beginner"` / `"intermediate"` / `"advanced"` |
| `technologies` | string[] | IDs des technos auxquelles ce nœud appartient |
| `explanation` | string | Explication simple, sans jargon, 2-4 phrases |
| `analogy` | string | Analogie du quotidien, 1-2 phrases |
| `example.language` | string | Langage du snippet (`"javascript"`, `"python"`, `"bash"`, etc.) |
| `example.code` | string | Snippet court, max ~10 lignes |
| `example.explanation` | string | Ce que fait le code, en 1-2 phrases |
| `prerequisites` | string[] | IDs des nœuds à maîtriser avant |
| `unlocks` | string[] | IDs des nœuds débloqués après validation |
| `projects` | Project[] | 1 à 3 mini-projets |

### Détail : Project

| Champ | Type | Description |
|---|---|---|
| `id` | string | Identifiant unique, kebab-case français |
| `label` | string | Titre court du projet |
| `difficulty` | enum | `"beginner"` / `"intermediate"` / `"advanced"` |
| `description` | string | Ce que l'apprenant doit faire, de façon concrète |
| `hint` | string | Un coup de pouce sans donner la solution |

---

## 4. État de progression (localStorage)

Ceci n'est pas stocké en base — c'est géré côté client dans le navigateur.

```json
{
  "version": 1,
  "progress": {
    "javascript": {
      "variables": {
        "status": "completed",
        "completed_at": "2026-05-14T18:32:00Z",
        "completed_project_id": "calculatrice-basique"
      },
      "fonctions": {
        "status": "in_progress"
      },
      "dom-manipulation": {
        "status": "locked"
      }
    }
  }
}
```

### Statuts possibles d'un nœud

| Statut | Signification |
|---|---|
| `"locked"` | Prérequis non complétés — nœud visible mais inaccessible |
| `"available"` | Prérequis complétés — nœud accessible |
| `"in_progress"` | Fiche ouverte mais projet non validé |
| `"completed"` | Projet validé manuellement par l'apprenant |

---

## 5. Règles métier importantes

- Un nœud est `"available"` uniquement si **tous** ses prérequis sont `"completed"`.
- Un nœud sans prérequis est `"available"` dès le départ (point d'entrée du graphe).
- L'apprenant valide lui-même un nœud en marquant un projet comme terminé — il n'y a pas de vérification automatique.
- Si un nœud appartient à plusieurs technos, sa fiche est la même partout — seuls les exemples de code peuvent varier selon la techno affichée.

---

## 6. Prompt type pour générer un nœud avec un LLM

```
Tu dois générer le contenu d'un nœud Velaluna pour le concept "[NOM DU CONCEPT]" en [TECHNOLOGIE].

Respecte exactement cette structure JSON :
- id : kebab-case, en français
- label : nom court du concept
- difficulty : "beginner", "intermediate" ou "advanced"
- explanation : 2 à 4 phrases simples, sans jargon technique, compréhensibles par quelqu'un qui n'a jamais programmé
- analogy : une analogie du quotidien, 1 à 2 phrases
- example.code : un snippet court (max 10 lignes), en [LANGAGE]
- example.explanation : ce que fait le code en 1 à 2 phrases
- projects : 1 à 3 mini-projets avec au moins un niveau beginner
- prerequisites : [IDS DES PRÉREQUIS]
- unlocks : [IDS DES NŒUDS DÉBLOQUÉS]

Ne génère que le JSON, sans texte autour.
```
