# NodeMap — Document de Vision

---

## 1. Vision & Problème

Apprendre la tech en 2026, ça ressemble souvent à ça : tu ouvres la documentation officielle, tu te retrouves noyé sous des centaines de pages mal organisées, avec des termes qui renvoient vers d'autres termes que tu ne connais pas encore, et aucune idée par où commencer.

Les plateformes comme freeCodeCamp, Udemy ou OpenClassrooms ne règlent pas vraiment le problème. Elles t'imposent un chemin tout tracé, du point A au point B, sans jamais te montrer comment les concepts se connectent entre eux. Tu suis le cours, mais tu ne vois pas la carte d'ensemble.

Le problème, c'est pas le manque de contenu. C'est que ce contenu est mal fichu pour apprendre.

NodeMap part d'une idée simple : les concepts techniques ne s'apprennent pas dans l'ordre, ils s'apprennent en réseau. Chaque notion est liée à d'autres, et comprendre ces liens, c'est ce qui fait vraiment progresser. NodeMap rend ces liens visibles.

---

## 2. Public cible

NodeMap s'adresse en priorité aux **débutants complets** — des gens qui veulent apprendre la tech mais ne savent pas par où commencer, qui se sont déjà perdus dans une doc ou abandonné un cours en ligne.

En secondaire, les **développeurs juniors** qui ont des bases mais veulent structurer et consolider ce qu'ils savent.

Aucun prérequis technique n'est nécessaire pour utiliser NodeMap.

---

## 3. Concept produit

Quand tu arrives sur NodeMap, tu choisis un thème (Web, Sécurité, Data...) puis une technologie. Tu te retrouves face à un graphe : des nœuds reliés entre eux par des flèches qui montrent quoi apprendre avant quoi.

Chaque nœud, c'est un concept. En cliquant dessus, tu accèdes à sa fiche :

- une explication simple, avec une analogie du quotidien
- un exemple concret et court
- un mini-projet pour mettre le concept en pratique

Les nœuds que tu n'es pas encore prêt à aborder sont visibles sur le graphe, mais verrouillés. Tu vois où tu vas, même si tu n'y es pas encore.

Un concept est considéré comme maîtrisé quand tu as réalisé le mini-projet associé et que tu le marques comme fait. C'est toi qui valides, pas un quiz automatique.

Au fur et à mesure, le graphe s'illumine. Tu vois ta progression d'un coup d'oeil. Quand tu as maîtrisé suffisamment de concepts autour d'un même sujet, NodeMap te suggère un projet plus ambitieux pour tout consolider.

Ta progression est sauvegardée dans ton navigateur, sans compte à créer. Tout le contenu est préparé à l'avance et stocké en base de données.

---

## 3. MVP

L'objectif du MVP est simple : une version utilisable, avec du vrai contenu, qui permet de valider que le concept fonctionne.

**2 thèmes, 4 technos :**

- Web : HTML/CSS, JavaScript
- Scripting : Bash (Linux CLI), Python

**Ce que le MVP inclut :**

- Le graphe interactif avec les nœuds et leurs liens de prérequis
- Une fiche par nœud : explication simple, analogie, exemple concret, mini-projet
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

## 4. Architecture & Stack

Les décisions techniques clés à trancher avant de commencer à coder.

**Framework frontend : Vue.js**
Tu connais déjà Vue, et quand on vibe-code, ajouter un nouveau framework par-dessus une nouvelle idée c'est risqué. Svelte est une bonne alternative à garder en tête pour un futur projet.

**Lib de graphe : Cytoscape.js ou vis.js**
Les deux fonctionnent avec Vue sans dépendances React. Cytoscape.js est plus mature et mieux documentée. vis.js est plus simple à prendre en main. À tester rapidement avec un prototype de graphe basique avant de trancher.

**Backend : Express ou Fastify (Node.js)**
Les deux sont légers, rapides à démarrer, et très bien connus des LLMs — ce qui aide beaucoup en vibe-coding. Adonis.js (le Laravel du Node.js) est une alternative plus structurée à garder en tête si le projet grossit et que tu veux plus de cadre.

**Base de données : à définir**
Doit stocker les nœuds, les liens entre eux, et le contenu des fiches. SQLite pour commencer, PostgreSQL pour la suite.

**Environnement de dev : Docker-compose**
Lance le frontend, le backend et la base de données en une seule commande. Evite les conflits d'environnement et facilite le démarrage sur une nouvelle machine.

**Hébergement : à définir**
Options gratuites pour démarrer : Vercel (frontend), Railway ou Render (backend + base de données).

**Format du contenu : JSON structuré**
Chaque fiche de nœud est un objet JSON avec des champs fixes : titre, explication, analogie, exemple, mini-projet, prérequis, nœuds débloqués.

**Génération du contenu : LLM + relecture manuelle**
Le contenu est généré avec un LLM à partir des documentations officielles, puis relu et corrigé avant d'être mis en base. Aucun contenu n'est généré à la volée pour l'utilisateur. Dans un premier temps, la relecture est assurée par le créateur du projet, avec des avis externes sollicités pour valider la clarté et la pertinence des fiches. À terme, ce processus s'ouvre à la communauté.

---

## 5. Roadmap

Ce qui vient après le MVP, dans l'ordre.

**Étape 1 : Comptes utilisateurs**
Remplacer le localStorage par de vrais comptes. L'utilisateur retrouve sa progression depuis n'importe quel appareil.

**Étape 2 : Nouveaux thèmes et technos**
Agrandir le catalogue au-delà du MVP. Pistes : Data, Sécurité, Réseaux, DevOps...

**Étape 3 : Projets consolidants**
Quand un groupe de nœuds est maîtrisé, NodeMap suggère un projet plus ambitieux pour tout mettre en pratique.

**Étape 4 : Contributions communautaires**
Permettre à la communauté de proposer des améliorations sur le contenu existant, ou de contribuer de nouveaux nœuds.

**Étape 5 : Monétisation (SaaS)**
NodeMap est open source. Le code est public et la communauté peut y contribuer. Le contenu de base reste gratuit et complet pour tout le monde. Le premium ajoute de la valeur sans rien bloquer :

- Stats avancées : suivi détaillé de la progression, temps passé, points forts et faibles
- Nœuds approfondis : contenu premium pour aller plus loin (cas avancés, edge cases, bonnes pratiques pro)
- Projets sur la plateforme : créer, publier et partager ses projets directement depuis NodeMap
- Version école : tableau de bord professeur, suivi des élèves, gestion de classes et parcours imposés
