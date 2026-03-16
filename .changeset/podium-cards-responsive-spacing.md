---
"dcx-benchmark-luxe-plugin": patch
---

Bloc `podium-cards` : responsive mobile et support spacing

- Media query `@media (max-width: 600px)` : cartes empilées verticalement, 1ère place en tête, `translateY` supprimé
- `padding-top: 1.5rem` sur `.dcx-podium` pour compenser l'élévation de la carte 1ère place
- `supports.spacing` (margin + padding) exposé dans `block.json`
