# Velaluna — Document de Vision

---

## 1. Vision & Problème

Apprendre la tech en 2026, ça ressemble souvent à ça : tu ouvres la documentation officielle, tu te retrouves noyé sous des centaines de pages mal organisées, avec des termes qui renvoient vers d'autres termes que tu ne connais pas encore, et aucune idée par où commencer.

Les plateformes comme freeCodeCamp, Udemy ou OpenClassrooms ne règlent pas vraiment le problème. Elles t'imposent un chemin tout tracé, du point A au point B, sans jamais te montrer comment les concepts se connectent entre eux. Tu suis le cours, mais tu ne vois pas la carte d'ensemble.

Le problème, c'est pas le manque de contenu. C'est que ce contenu est mal fichu pour apprendre.

Velaluna part d'une idée simple : les concepts techniques ne s'apprennent pas dans l'ordre, ils s'apprennent en réseau. Chaque notion est liée à d'autres, et comprendre ces liens, c'est ce qui fait vraiment progresser. Velaluna rend ces liens visibles.

---

## 2. Public cible

Velaluna s'adresse en priorité aux **débutants complets** — des gens qui veulent apprendre la tech mais ne savent pas par où commencer, qui se sont déjà perdus dans une doc ou abandonné un cours en ligne.

En secondaire, les **développeurs juniors** qui ont des bases mais veulent structurer et consolider ce qu'ils savent.

Aucun prérequis technique n'est nécessaire pour utiliser Velaluna.

---

## 3. Concept produit

Quand tu arrives sur Velaluna, tu choisis un thème (Web, Sécurité, Data...) puis une technologie. Tu te retrouves face à un graphe : des nœuds reliés entre eux par des flèches qui montrent quoi apprendre avant quoi.

Chaque nœud, c'est un concept. En cliquant dessus, tu accèdes à sa fiche :

- une explication simple, avec une analogie du quotidien
- un exemple concret et court
- un ou plusieurs mini-projets pour mettre le concept en pratique

Les nœuds que tu n'es pas encore prêt à aborder sont visibles sur le graphe, mais verrouillés. Tu vois où tu vas, même si tu n'y es pas encore.

Un concept est considéré comme maîtrisé quand tu as réalisé le mini-projet associé et que tu le marques comme fait. C'est toi qui valides, pas un quiz automatique.

Au fur et à mesure, le graphe s'illumine. Tu vois ta progression d'un coup d'oeil. Quand tu as maîtrisé suffisamment de concepts autour d'un même sujet, Velaluna te suggère un projet plus ambitieux pour tout consolider.

Ta progression est sauvegardée dans ton navigateur, sans compte à créer. Tout le contenu est préparé à l'avance et stocké en base de données.

---

## 4. MVP

L'objectif du MVP est simple : une version utilisable, avec du vrai contenu, qui permet de valider que le concept fonctionne.

**2 thèmes, 4 technos :**

- Web : HTML/CSS, JavaScript
- Scripting : Bash (Linux CLI), Python

**Ce que le MVP inclut :**

- Le graphe interactif avec les nœuds et leurs liens de prérequis
- Une fiche par nœud : explication simple, analogie, exemple concret, mini-projet(s)
- Les nœuds verrouillés tant que les prérequis ne sont pas validés
- La validation manuelle : l'utilisateur marque lui-même un nœud comme maîtrisé
- La progression sauvegardée dans le navigateur (localStorage, sans compte)
- Le contenu préparé à l'avance avec un LLM, relu et corrigé avant mise en ligne

**Ce que le MVP n'inclut pas :**

- Comptes utilisateurs
- Fonctionnalités communautaires
- Suggestions de projets consolidants
- Moteur de recherche

---

## 5. Architecture & Stack

**Framework frontend : Vue.js**
Composition API, Vue 3 + Vite. Svelte est une bonne alternative à garder en tête pour un futur projet.

**Lib de graphe : Cytoscape.js** ✓
Choix retenu après comparaison avec vis.js. Le layout `dagre` gère nativement les graphes orientés avec prérequis. Les classes CSS dynamiques rendent l'état verrouillé/disponible/complété trivial à implémenter.

**Gestion d'état frontend : Pinia**
Store officiel Vue 3. Gère la progression locale et l'état du graphe.

**Backend : Express (Node.js)**
Léger, rapide à démarrer, excellent coverage LLM — idéal pour le vibe-coding.

**Base de données : SQLite (MVP) → PostgreSQL (suite)**
SQLite pour le MVP : zéro config, embarqué. Migration vers PostgreSQL à l'étape comptes utilisateurs.

**Environnement de dev : Docker Compose**
Lance le frontend, le backend et la base de données en une seule commande.

**Hébergement : à définir**
Options gratuites pour démarrer : Vercel (frontend), Railway ou Render (backend + base de données).

**Format du contenu : JSON structuré**
Voir `velaluna-data-schema.md` pour la structure exacte.

**Génération du contenu : LLM + relecture manuelle**
Le contenu est généré avec un LLM à partir des documentations officielles, puis relu et corrigé avant d'être mis en base. Aucun contenu n'est généré à la volée pour l'utilisateur.

---

## 6. Roadmap

**Étape 1 : Comptes utilisateurs**
Remplacer le localStorage par de vrais comptes. L'utilisateur retrouve sa progression depuis n'importe quel appareil.

**Étape 2 : Nouveaux thèmes et technos**
Agrandir le catalogue au-delà du MVP. Pistes : Data, Sécurité, Réseaux, DevOps...

**Étape 3 : Projets consolidants**
Quand un groupe de nœuds est maîtrisé, Velaluna suggère un projet plus ambitieux pour tout mettre en pratique.

**Étape 4 : Contributions communautaires**
Permettre à la communauté de proposer des améliorations sur le contenu existant, ou de contribuer de nouveaux nœuds.

**Étape 5 : Monétisation (SaaS)**
Velaluna est open source. Le contenu de base reste gratuit et complet pour tout le monde. Le premium ajoute de la valeur sans rien bloquer :

- Stats avancées : suivi détaillé de la progression, temps passé, points forts et faibles
- Nœuds approfondis : contenu premium pour aller plus loin (cas avancés, edge cases, bonnes pratiques pro)
- Projets sur la plateforme : créer, publier et partager ses projets directement depuis Velaluna
- Version école : tableau de bord professeur, suivi des élèves, gestion de classes et parcours imposés
