# dcx-benchmark-luxe-plugin

## 1.2.0

### Minor Changes

-   f31c9f1: feat: remplacer git-updater par plugin-update-checker (PUC)

    Le mécanisme de mise à jour automatique est désormais embarqué directement dans le plugin via la bibliothèque plugin-update-checker (YahnisElsts/plugin-update-checker v5). Aucun plugin tiers à installer sur le site WordPress — PUC surveille les GitHub Releases et propose les mises à jour dans le tableau de bord WordPress nativement.

## 1.1.2

### Patch Changes

-   167d74e: ci(release): migrer vers Node.js 24 et corriger la détection de publication

    -   Corrige la création de la GitHub Release qui était systématiquement skippée (condition `published == 'true'` jamais satisfaite sans publish npm)
    -   Détection basée sur le message de commit Changesets, fiable sans registry
    -   Node.js 20 → 24 dans le workflow (dépréciation GitHub Actions)
    -   `private: true` dans package.json pour éviter tout publish npm accidentel

## 1.1.1

### Patch Changes

-   6764a62: feat(stat-card): stocker les couleurs du thème comme variables CSS WordPress

    Quand une couleur de la palette du thème est sélectionnée dans le bloc stat-card, la valeur stockée est désormais `var(--wp--preset--color--{slug})` plutôt que la valeur hex brute. Les couleurs custom (hors palette) restent en hex. Cela garantit que les blocs suivent automatiquement les changements de couleur du thème.

## 1.1.0

### Minor Changes

-   Mise en place du système de versioning (Changesets) et de publication automatique via GitHub Actions. Compatibilité git-updater pour les mises à jour depuis le tableau de bord WordPress.
