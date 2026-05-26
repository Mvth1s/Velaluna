## [1.0.2](https://github.com/Mvth1s/Velaluna/compare/v1.0.1...v1.0.2) (2026-05-26)


### Bug Fixes

* **security:** supprime les credentials hardcodés et sécurise la config ([27823fb](https://github.com/Mvth1s/Velaluna/commit/27823fb950180f02be6bb1f683da9f07f7d03f4c))

## [1.0.1](https://github.com/Mvth1s/Velaluna/compare/v1.0.0...v1.0.1) (2026-05-19)


### Bug Fixes

* set DATABASE_URL reference variable in railway.toml ([6acdf8b](https://github.com/Mvth1s/Velaluna/commit/6acdf8bcd8f612b95cf8d4909ed6aacfc85a2863))

# 1.0.0 (2026-05-18)


### Bug Fixes

* **ci:** désactive body/footer-max-line-length dans commitlint ([222f297](https://github.com/Mvth1s/Velaluna/commit/222f29724344eda730a7259ca682b42a56cd93ca))
* **devops:** ajoute .dockerignore et lance le seed au démarrage du backend ([b2bd3cc](https://github.com/Mvth1s/Velaluna/commit/b2bd3ccb765b88002911e942c0cac1f4c4bbc772))
* **devops:** corrige l'email pgAdmin (.local invalide → .dev) ([31f008d](https://github.com/Mvth1s/Velaluna/commit/31f008ddddfc646bc6293b2c3e9d9551002c3871))
* **devops:** préfixe /api sur les routes Express pour la production ([822d714](https://github.com/Mvth1s/Velaluna/commit/822d714dad4d802d6bd02ad4f2e04553cd117d0b))
* **frontend:** agrandit le logo carré (home) et les logos des headers ([8eca1c8](https://github.com/Mvth1s/Velaluna/commit/8eca1c8e4c8029808112aa27c5ce28fd64e8ea30))
* **frontend:** ajuste navigation ThemeView et boucle de sélection recherche ([e107a22](https://github.com/Mvth1s/Velaluna/commit/e107a22562a86f655a2ba8940399c6cbd8d191df))
* **frontend:** corrections mobile — logo banner, NodeCard plein écran, graphe compact ([144f6bd](https://github.com/Mvth1s/Velaluna/commit/144f6bd0ec6f0d9c8cc9265d328417387e21af4d))
* **frontend:** corrige 3 bugs post-review de la recherche ([5e7ad45](https://github.com/Mvth1s/Velaluna/commit/5e7ad453c63c2d6500bae57fc64f39302842f481))
* **frontend:** corrige la NodeCard cachée derrière le canvas Cytoscape ([127178b](https://github.com/Mvth1s/Velaluna/commit/127178bc4db89ecbc7253ee0ff251963a7a9cc22))
* **frontend:** corrige les watches Cytoscape pour les ComputedRefs ([ca8e2a5](https://github.com/Mvth1s/Velaluna/commit/ca8e2a5e1cf5925064eb54c93c960dc5815715ac))
* **frontend:** corrige resetTechProgress qui ne déclenchait pas la réactivité Vue ([644fd25](https://github.com/Mvth1s/Velaluna/commit/644fd2533a98daf7278276a2d6ce8e7b210253ca))
* **frontend:** déplace "Choisir un autre thème" au-dessus de la grille ([e9a76bb](https://github.com/Mvth1s/Velaluna/commit/e9a76bbdd492efb721deae904c914560a6974264))
* **frontend:** déplace "Choisir un autre thème" dans le body de ThemeView ([f828a86](https://github.com/Mvth1s/Velaluna/commit/f828a8620430fef0c4790df787c91a0d94b7423c))
* **frontend:** distinction couleurs, étoiles animées, logo home ([9bb1e99](https://github.com/Mvth1s/Velaluna/commit/9bb1e99f6996378170f7822e2ad14af87ab1fcf2)), closes [#C8B898](https://github.com/Mvth1s/Velaluna/issues/C8B898) [#C8832A](https://github.com/Mvth1s/Velaluna/issues/C8832A) [#E8E3D8](https://github.com/Mvth1s/Velaluna/issues/E8E3D8)
* **frontend:** grille technos invisible + fond canvas étoilé ([f8fe17b](https://github.com/Mvth1s/Velaluna/commit/f8fe17b05d56479c745fdd957eb5f9a9b1b9a5b2)), closes [#00001A](https://github.com/Mvth1s/Velaluna/issues/00001A)
* **frontend:** logos transparents, retire banner home ([349e6e5](https://github.com/Mvth1s/Velaluna/commit/349e6e5cd0539e247aad07bded070e504acd537a))
* **frontend:** popup mobile 95vh avec arrondi, logo header 40px ([a8a8a32](https://github.com/Mvth1s/Velaluna/commit/a8a8a325f21a1615e42279b352e85f2205e5d87c))
* **frontend:** popup mobile centrée 90vw avec scroll vertical ([e48e89b](https://github.com/Mvth1s/Velaluna/commit/e48e89b2896e2271b0264ccacc198997915e6b94))
* **frontend:** remplace constellation par logo carré sur la home ([d051473](https://github.com/Mvth1s/Velaluna/commit/d051473096fecac20dfae332727582e4f3e0e037))
* **frontend:** repositionne et stylise le bouton de retour dans ThemeView ([77a406b](https://github.com/Mvth1s/Velaluna/commit/77a406bb49915f082d2ea14b20aad62f39665be2))
* **frontend:** supprime les erreurs TypeScript post-refonte ([8cd0a77](https://github.com/Mvth1s/Velaluna/commit/8cd0a77e6865d3368360d6642b0cc94421b3b7f7))
* **k6:** supprime le test 404 du script de charge, corrige commande Docker ([9b1a2d1](https://github.com/Mvth1s/Velaluna/commit/9b1a2d1fdf83d4da4a0a60ea36e31313de164dc1))


### Features

* **backend:** migration SQLite → PostgreSQL ([36ee19d](https://github.com/Mvth1s/Velaluna/commit/36ee19d996e6cdf3e1c7b265a11f48f837a4f657))
* **devops:** ajoute le déploiement Railway (Dockerfile production) ([7ce77ff](https://github.com/Mvth1s/Velaluna/commit/7ce77ffa44b4fc90d0c81cf189ecf612297d42bf))
* **devops:** ajoute pgAdmin, Prometheus et Grafana dans Docker Compose ([9bf831f](https://github.com/Mvth1s/Velaluna/commit/9bf831f3ebdc7cc14e9cb7464b31fdd8e3e4336c))
* **frontend:** ajoute la recherche globale (Cmd/Ctrl+K) ([231538d](https://github.com/Mvth1s/Velaluna/commit/231538dac86dab3c3b18258884043aeb41e7d578))
* **frontend:** animation de célébration quand tous les nœuds sont validés ([065dea0](https://github.com/Mvth1s/Velaluna/commit/065dea04eaa157ecf46655e17d871cefc608dbb4))
* **frontend:** animations — canvas StarField, célébration maîtrise, boutons navigation ([36cfac5](https://github.com/Mvth1s/Velaluna/commit/36cfac5a533fc1eb13b34b0bd5bc76d5f6beeb2b))
* **frontend:** bannière de complétion et reset de progression par techno ([0830b48](https://github.com/Mvth1s/Velaluna/commit/0830b48061c80f61835a21f8da36169c3220ae54))
* **frontend:** charte graphique, navigation 3 étapes, logos SVG ([ae23475](https://github.com/Mvth1s/Velaluna/commit/ae23475556b8e9083607a40bf23b135c458907ca))
* **frontend:** coloration syntaxique, label techno et compteur de progression ([0877df6](https://github.com/Mvth1s/Velaluna/commit/0877df6cff7aef3f3c0605e7c1cd8e419342213d))
* **frontend:** intègre la charte graphique Velaluna — thème spatial ([e23cb6c](https://github.com/Mvth1s/Velaluna/commit/e23cb6cc57f57a88e1dda893cd3ea61670347e0a))
* **frontend:** navigation 3 étapes, police Cormorant Garamond, barres de progression ([8992759](https://github.com/Mvth1s/Velaluna/commit/899275944c2d9559497b05502d5831df399d1ac8))
* **frontend:** page de progression globale + logos des technos ([ad1f80c](https://github.com/Mvth1s/Velaluna/commit/ad1f80c2d9c692a72b9a866d81f9ec1092045b8d))
* **frontend:** progression HomeView, prérequis précis, touche Escape ([07254d2](https://github.com/Mvth1s/Velaluna/commit/07254d24fc329aee98c6f8dad6055f3e6097bcc0))
* **frontend:** refonte charte graphique — couleurs plates Cytoscape, token --color-done ([eeb911b](https://github.com/Mvth1s/Velaluna/commit/eeb911b4a89a264e0f7d8d6788d6e5156a0b4d8e))
* **frontend:** refonte visuelle complète — charte graphique Velaluna ([4eed203](https://github.com/Mvth1s/Velaluna/commit/4eed2031ac7904abfac1362f552aa05d40e2956c))
* **frontend:** responsive mobile (breakpoint 640px) ([b5e9c11](https://github.com/Mvth1s/Velaluna/commit/b5e9c116520227174eaf4a6e6b4668ada9c56119))
* **frontend:** ui-redesign — modale NodeCard, étoiles animées, cartes agrandies ([f5369b1](https://github.com/Mvth1s/Velaluna/commit/f5369b170577af104dc13fb51d20ec5c2f2e463c))
* **k6:** scripts de tests de charge ([6aa7dcd](https://github.com/Mvth1s/Velaluna/commit/6aa7dcd2803bc6bb1c8248c06a0a4ef13b2aa7b6))
* **observability:** métriques Prometheus + dashboard Grafana ([396dfb1](https://github.com/Mvth1s/Velaluna/commit/396dfb13512a624800680af5538f0d5d8ee34a3c))
