---
"dcx-benchmark-luxe-plugin": patch
---

refactor(charts): migrer le bouton insight vers la structure wp-block-buttons

Suppression des styles custom `&__insight-btn`. Le bouton insight utilise
désormais la même structure native `wp-block-buttons > wp-block-button >
wp-block-button__link` que les blocs button WordPress.
