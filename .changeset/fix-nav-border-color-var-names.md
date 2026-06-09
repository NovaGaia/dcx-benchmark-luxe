---
"dcx-benchmark-luxe-plugin": patch
---

fix(nav-filters): rename CSS vars to avoid spurious borders from WP core

WordPress core applies `border-style: solid` to any element whose `style` attribute contains the string "border-color" (`html :where([style*=border-color])`). The custom vars `--nav-item-border-color-*` injected on `<nav>` and `<ul>` triggered this selector, producing two unwanted borders.

Renamed to `--nav-item-bdc-*` (and `--nav-item-bdc` for the unified variant) across `nav-filters.php`, `index.js`, `nav-base.css`, and `nav-internal.css`.
