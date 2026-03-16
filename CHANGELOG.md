# dcx-benchmark-luxe-plugin

## 1.1.1

### Patch Changes

-   6764a62: feat(stat-card): stocker les couleurs du thème comme variables CSS WordPress

    Quand une couleur de la palette du thème est sélectionnée dans le bloc stat-card, la valeur stockée est désormais `var(--wp--preset--color--{slug})` plutôt que la valeur hex brute. Les couleurs custom (hors palette) restent en hex. Cela garantit que les blocs suivent automatiquement les changements de couleur du thème.

## 1.1.0

### Minor Changes

-   Mise en place du système de versioning (Changesets) et de publication automatique via GitHub Actions. Compatibilité git-updater pour les mises à jour depuis le tableau de bord WordPress.
