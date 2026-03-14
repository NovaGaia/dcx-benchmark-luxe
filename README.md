# dcx-benchmark-luxe

Plugin WordPress qui enregistre des blocs Gutenberg React pour les pages benchmark luxe.

## Commandes

```bash
pnpm start         # watch mode (développement, hot-reload)
pnpm build         # build de production dans build/
pnpm lint:js       # lint JavaScript/JSX
pnpm lint:css      # lint SCSS/CSS
```

## Blocs disponibles

### `dcx-benchmark-luxe/stat-card`

Carte statistique affichant un chiffre clé avec suffixe et libellé.

**Fichiers :** `src/blocks/stat-card/`

**Attributs :**

| Attribut        | Type   | Défaut  | Description                                 |
|-----------------|--------|---------|---------------------------------------------|
| `number`        | string | `""`    | Chiffre principal (édition inline RichText dans le canvas) |
| `suffix`        | string | `""`    | Suffixe optionnel (ex. `"rd"`, `"%"`)       |
| `suffixPosition`| string | `"sup"` | Position du suffixe : `"sup"` (exposant) ou `"sub"` (indice) |
| `label`         | string | `""`    | Libellé descriptif (édition inline RichText dans le canvas) |
| `accentColor`      | string | `""`    | Couleur de la bordure supérieure d'accent (hex, rgb…) |
| `accentBorderWidth`| number | `4`     | Épaisseur de la bordure supérieure en px (RangeControl sidebar, 1–20) |
| `numberColor`   | string | `""`    | Couleur du chiffre (ColorPalette sidebar)   |
| `numberFontSize`| string | `""`    | Taille de police du chiffre (FontSizePicker sidebar) |
| `labelColor`    | string | `""`    | Couleur du libellé (ColorPalette sidebar)   |
| `labelFontSize` | string | `""`    | Taille de police du libellé (FontSizePicker sidebar) |

**Supports WordPress :**
- Bordure (`__experimentalBorder`) : rayon, largeur, style (couleur désactivée — gérée par `accentColor`)
- Alignement

**Édition inline :** `number` et `label` s'éditent directement dans le canvas Gutenberg via `RichText` (sans formatage autorisé). `suffix` et `suffixPosition` restent dans la sidebar.

**Comportement de la bordure supérieure d'accent :**
`accentColor` et `accentBorderWidth` contrôlent la bordure supérieure via des CSS custom properties injectées en inline style. Le support couleur natif de WordPress est désactivé (`"color": false`) pour éviter le conflit avec `.has-contrast-border-color !important`.

**CSS custom properties exposées :**

| Variable                  | Description                          | Défaut        |
|---------------------------|--------------------------------------|---------------|
| `--dcx-stat-accent`       | Couleur de la bordure supérieure     | `transparent` |
| `--dcx-stat-accent-width` | Épaisseur de la bordure supérieure   | `4px`         |

---

### `dcx-benchmark-luxe/horizontal-bar-chart`

Graphique à barres horizontales avec configuration des couleurs via la page de réglages admin.

**Page de réglages :** Settings → DCX Benchmark Luxe (dans l'admin WordPress)

**Option WordPress :** `dcx_benchmark_luxe_bar_colors` (tableau de codes hex)

**Couleurs par défaut :** `#1a2b4a`, `#4cb8c4`, `#5c6bc0`, `#e57373`, `#9e9e9e`

Les couleurs sont passées à l'éditeur Gutenberg via `wp_localize_script` sous l'objet `dcxBarChartSettings.barColors`.

---

## Documentation

Le dossier `docs/` contient des notes techniques sur des patterns utilisés dans le projet :

- [`docs/dark-mode-theme-json.md`](./docs/dark-mode-theme-json.md) — Dark mode natif avec `light-dark()` + `color-scheme` dans `theme.json`

