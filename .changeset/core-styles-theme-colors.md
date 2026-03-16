---
"dcx-benchmark-luxe-plugin": patch
---

Bloc `core-styles` : variantes de couleur alignées sur la palette du `theme.json`

- Remplace le compteur arbitraire `accent-1..6` par la liste exhaustive des slugs réels du thème
- Ajoute les variantes `custom-secondary-1..5`, `custom-digit-1..2`, `contrast`
- Supprime la variante `accent-6` qui n'existe pas dans le thème
- `style.scss` : `@for` → `@each $slug in (...)` sur les slugs du thème
- `index.js` : tableau explicite avec les vrais labels du `theme.json`
