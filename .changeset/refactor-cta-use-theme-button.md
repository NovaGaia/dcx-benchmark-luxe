---
"dcx-benchmark-luxe-plugin": patch
---

refactor(cta): supprimer useThemeButton, bouton toujours en style thème

Le toggle "Style bouton du thème" est supprimé — le bouton CTA utilise
désormais systématiquement `wp-block-button__link wp-element-button`
encapsulé dans la structure native `wp-block-buttons`. Les blocs
existants sont migrés automatiquement via `deprecated.js` (v1 et v2).
