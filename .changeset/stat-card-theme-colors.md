---
"dcx-benchmark-luxe-plugin": patch
---

feat(stat-card): stocker les couleurs du thème comme variables CSS WordPress

Quand une couleur de la palette du thème est sélectionnée dans le bloc stat-card, la valeur stockée est désormais `var(--wp--preset--color--{slug})` plutôt que la valeur hex brute. Les couleurs custom (hors palette) restent en hex. Cela garantit que les blocs suivent automatiquement les changements de couleur du thème.
