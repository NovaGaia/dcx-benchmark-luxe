---
"dcx-benchmark-luxe-plugin": patch
---

ci(release): migrer vers Node.js 24 et corriger la détection de publication

- Corrige la création de la GitHub Release qui était systématiquement skippée (condition `published == 'true'` jamais satisfaite sans publish npm)
- Détection basée sur le message de commit Changesets, fiable sans registry
- Node.js 20 → 24 dans le workflow (dépréciation GitHub Actions)
- `private: true` dans package.json pour éviter tout publish npm accidentel
