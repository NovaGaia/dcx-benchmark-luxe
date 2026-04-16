---
"dcx-benchmark-luxe-plugin": minor
---

feat(nav-filters): ajout des couleurs de bordure par côté pour core/navigation

- Nouveau panneau "Couleur de bordure" dans l'onglet Styles avec toggle lié/délié
- Mode lié : un seul picker applique `--nav-item-border-color` sur les 4 côtés
- Mode délié : 4 pickers indépendants (Haut, Droite, Bas, Gauche) → `--nav-item-border-color-top/right/bottom/left`
- PHP : injection des nouvelles CSS vars sur `<nav>` et `<ul>` en frontend
- Thème : migration de `border-color` vers les 4 propriétés `border-*-color` avec fallback chaîné
