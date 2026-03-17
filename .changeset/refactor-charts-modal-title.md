---
"dcx-benchmark-luxe-plugin": patch
---

refactor(charts): supprimer l'attribut `modalTitle` redondant

Le texte du bouton insight (`insightText`) est désormais utilisé directement comme titre de la modale — les deux champs étant toujours identiques, `modalTitle` est supprimé.
