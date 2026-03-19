---
"dcx-benchmark-luxe-plugin": minor
---

Nouveau bloc `dcx-benchmark-luxe/blurred-section` : conteneur avec effet de flou progressif (`backdrop-filter`), overlay CTA éditable en inline et modal HubSpot (iframe). La modal est gérée par `view.js` et déplacée vers `document.body` pour éviter les conflits de stacking context. Fermeture via croix, fond ou touche `Escape`.

Fix `charts` : padding `safe-area-inset` sur la modal pour les appareils à encoche ; largeur de la modal interne passée de `min(560px, calc(100vw - 2rem))` à `min(560px, 100%)`.
