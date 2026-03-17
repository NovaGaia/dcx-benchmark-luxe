---
"dcx-benchmark-luxe-plugin": patch
---

fix(charts, cta): corriger le chargement des styles du bouton WordPress et l'ouverture du modal insight

- Enqueue `wp-block-button` et `wp-block-buttons` à priorité 1 (avant `wp_add_global_styles_for_blocks()` qui tourne à priorité 10), afin que WordPress injecte correctement le CSS de bloc issu du `theme.json` (couleur teal `accent-1`, `border-radius: 22px`, `box-shadow`). Sans cette priorité, le check `in_array( $block_handle, $wp_styles->queue )` échoue et le CSS n'est pas généré.
- Ajoute la classe `dcx-bar-chart__insight-btn` au bouton insight dans `render.php` (front-end) et `edit.js` (éditeur) : `view.js` utilisait ce sélecteur pour initialiser le modal, mais la classe était absente — le modal ne s'ouvrait donc jamais.
- Supprime la fonction `dcx_benchmark_luxe_add_button_block_global_styles()` devenue inutile (approche via `WP_Theme_JSON_Resolver::get_stylesheet()` contournée par la solution priorité 1).
