---
"dcx-benchmark-luxe-plugin": patch
---

Fix webpack config so custom blocks are compiled. The entry override now uses an async function to correctly await block auto-discovery from `@wordpress/scripts` v27+.
