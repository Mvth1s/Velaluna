# /content — Données NodeMap

Ce dossier contient tout le contenu de NodeMap au format JSON.
Il est la source de vérité : le script `backend/src/db/seed.ts` lit ces fichiers et peuple la base SQLite.

## Structure

```
content/
├── themes/
│   ├── web.json
│   └── scripting.json
├── technologies/
│   ├── html-css.json
│   ├── javascript.json
│   ├── python.json
│   └── bash.json
└── nodes/
    ├── html-css/
    │   ├── structure-html.json
    │   └── ...
    ├── javascript/
    │   ├── variables.json
    │   ├── types-de-donnees.json
    │   ├── fonctions.json
    │   └── ...
    ├── python/
    └── bash/
```

## Règles

- Un fichier JSON par entité
- Respecter exactement le schéma défini dans `data-schema.md`
- Les IDs sont en kebab-case français (ex: `types-de-donnees`)
- Un nœud partagé entre plusieurs technos (ex: `variables`) est placé dans le dossier de sa techno principale et référencé dans les autres via son ID
- Ne jamais modifier un JSON directement en prod — modifier le fichier source et relancer le seed
