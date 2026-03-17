# dcx-benchmark-luxe-plugin

## 1.3.1

### Patch Changes

-   a2c27b2: refactor(charts): migrer le bouton insight vers la structure wp-block-buttons

    Suppression des styles custom `&__insight-btn`. Le bouton insight utilise
    désormais la même structure native `wp-block-buttons > wp-block-button >
wp-block-button__link` que les blocs button WordPress.

-   bd14295: refactor(charts): supprimer l'attribut `modalTitle` redondant

    Le texte du bouton insight (`insightText`) est désormais utilisé directement comme titre de la modale — les deux champs étant toujours identiques, `modalTitle` est supprimé.

-   c8c3fbe: refactor(cta): supprimer useThemeButton, bouton toujours en style thème

    Le toggle "Style bouton du thème" est supprimé — le bouton CTA utilise
    désormais systématiquement `wp-block-button__link wp-element-button`
    encapsulé dans la structure native `wp-block-buttons`. Les blocs
    existants sont migrés automatiquement via `deprecated.js` (v1 et v2).

## 1.3.0

### Minor Changes

-   e17c353: Nouveau bloc `dcx-benchmark-luxe/cta` — encart Call-to-Action centré

    -   Titre et description éditables en ligne (RichText, bold/italic autorisés)
    -   Texte du bouton éditable en ligne, URL et emoji configurables en sidebar
    -   Toggle "Ouvrir dans un nouvel onglet" (`target="_blank" rel="noreferrer noopener"`)
    -   Toggle "Style bouton du thème" : applique `wp-element-button wp-block-button__link` ou style pill custom (`#1b2b4b`, `border-radius: 999px`)
    -   Couleur et taille de police par élément (titre, description) via `ColorPalette` + `FontSizePicker`
    -   Supports natifs WordPress : couleur (fond/texte/dégradés), spacing (margin/padding/blockGap), ombre, bordure/rayon
    -   Espacement entre éléments via les presets `theme.json` (`blockGap`) — valeur convertie du format interne WordPress (`var:preset|spacing|N`) en CSS valide avant injection
    -   Styles `core-styles` (DCX Shadow + variantes couleur) disponibles sur ce bloc

## 1.2.2

### Patch Changes

-   6e3db8c: Bloc `core-styles` : variantes de couleur alignées sur la palette du `theme.json`

    -   Remplace le compteur arbitraire `accent-1..6` par la liste exhaustive des slugs réels du thème
    -   Ajoute les variantes `custom-secondary-1..5`, `custom-digit-1..2`, `contrast`
    -   Supprime la variante `accent-6` qui n'existe pas dans le thème
    -   `style.scss` : `@for` → `@each $slug in (...)` sur les slugs du thème
    -   `index.js` : tableau explicite avec les vrais labels du `theme.json`

## 1.2.1

### Patch Changes

-   6a18f4b: Bloc `podium-cards` : responsive mobile et support spacing

    -   Media query `@media (max-width: 600px)` : cartes empilées verticalement, 1ère place en tête, `translateY` supprimé
    -   `padding-top: 1.5rem` sur `.dcx-podium` pour compenser l'élévation de la carte 1ère place
    -   `supports.spacing` (margin + padding) exposé dans `block.json`

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
