---
"dcx-benchmark-luxe-plugin": minor
---

Nouveau bloc `dcx-benchmark-luxe/cta` — encart Call-to-Action centré

- Titre et description éditables en ligne (RichText, bold/italic autorisés)
- Texte du bouton éditable en ligne, URL et emoji configurables en sidebar
- Toggle "Ouvrir dans un nouvel onglet" (`target="_blank" rel="noreferrer noopener"`)
- Toggle "Style bouton du thème" : applique `wp-element-button wp-block-button__link` ou style pill custom (`#1b2b4b`, `border-radius: 999px`)
- Couleur et taille de police par élément (titre, description) via `ColorPalette` + `FontSizePicker`
- Supports natifs WordPress : couleur (fond/texte/dégradés), spacing (margin/padding/blockGap), ombre, bordure/rayon
- Espacement entre éléments via les presets `theme.json` (`blockGap`) — valeur convertie du format interne WordPress (`var:preset|spacing|N`) en CSS valide avant injection
- Styles `core-styles` (DCX Shadow + variantes couleur) disponibles sur ce bloc
