# dcx-benchmark-luxe-plugin

## 1.5.2

### Patch Changes

-   606b207: fix(release): inclut le dossier assets/ dans le ZIP de release pour corriger les 404 sur nav-base.css et nav-internal.css

## 1.5.1

### Patch Changes

-   f1fb9fb: fix(blocks): supprime les références editorStyle inexistantes qui causaient des 404 en production

## 1.5.0

### Minor Changes

-   a2c155d: feat(nav-filters): ajout des couleurs de bordure par côté pour core/navigation

    -   Nouveau panneau "Couleur de bordure" dans l'onglet Styles avec toggle lié/délié
    -   Mode lié : un seul picker applique `--nav-item-border-color` sur les 4 côtés
    -   Mode délié : 4 pickers indépendants (Haut, Droite, Bas, Gauche) → `--nav-item-border-color-top/right/bottom/left`
    -   PHP : injection des nouvelles CSS vars sur `<nav>` et `<ul>` en frontend
    -   Thème : migration de `border-color` vers les 4 propriétés `border-*-color` avec fallback chaîné

### Patch Changes

-   9d34294: docs(readme): supprime core-styles (bloc supprimé), documente nav-filters
-   e20071c: Supprime le bloc core-styles — les block styles dcx-box-\* et le CSS associé sont désormais gérés dynamiquement par le thème via wp_get_global_settings().

## 1.4.0

### Minor Changes

-   cd20385: Nouveau bloc `dcx-benchmark-luxe/blurred-section` : conteneur avec effet de flou progressif (`backdrop-filter`), overlay CTA éditable en inline et modal HubSpot (iframe). La modal est gérée par `view.js` et déplacée vers `document.body` pour éviter les conflits de stacking context. Fermeture via croix, fond ou touche `Escape`.

    Fix `charts` : padding `safe-area-inset` sur la modal pour les appareils à encoche ; largeur de la modal interne passée de `min(560px, calc(100vw - 2rem))` à `min(560px, 100%)`.

## 1.3.2

### Patch Changes

-   99c18ba: fix(charts, cta): corriger le chargement des styles du bouton WordPress et l'ouverture du modal insight

    -   Enqueue `wp-block-button` et `wp-block-buttons` à priorité 1 (avant `wp_add_global_styles_for_blocks()` qui tourne à priorité 10), afin que WordPress injecte correctement le CSS de bloc issu du `theme.json` (couleur teal `accent-1`, `border-radius: 22px`, `box-shadow`). Sans cette priorité, le check `in_array( $block_handle, $wp_styles->queue )` échoue et le CSS n'est pas généré.
    -   Ajoute la classe `dcx-bar-chart__insight-btn` au bouton insight dans `render.php` (front-end) et `edit.js` (éditeur) : `view.js` utilisait ce sélecteur pour initialiser le modal, mais la classe était absente — le modal ne s'ouvrait donc jamais.
    -   Supprime la fonction `dcx_benchmark_luxe_add_button_block_global_styles()` devenue inutile (approche via `WP_Theme_JSON_Resolver::get_stylesheet()` contournée par la solution priorité 1).

## 1.3.1

### Patch Changes

-   a2c27b2: refactor(charts): migrer le bouton insight vers la structure wp-block-buttons

        Suppression des styles custom `&__insight-btn`. Le bouton insight utilise
        désormais la même structure native `wp-block-buttons > wp-block-button >

    wp-block-button\_\_link` que les blocs button WordPress.

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
