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

### `dcx-benchmark-luxe/charts`

Graphique de données (barres horizontales ou camembert) avec insight et modale. Les couleurs sont configurables via la page de réglages admin.

**Fichiers :** `src/blocks/charts/`

**Page de réglages :** Settings → DCX Benchmark Luxe (dans l'admin WordPress)

**Option WordPress :** `dcx_benchmark_luxe_bar_colors` (tableau de codes hex)

**Couleurs par défaut :** `#1a2b4a`, `#4cb8c4`, `#5c6bc0`, `#e57373`, `#9e9e9e`

Les couleurs sont passées à l'éditeur Gutenberg via `wp_localize_script` sous l'objet `dcxBarChartSettings.barColors`.

---

### `dcx-benchmark-luxe/core-styles`

Bloc interne (non visible dans l'inserter) qui enregistre des **Block Styles** pour les blocs core et les blocs custom du plugin.

**Fichiers :** `src/blocks/core-styles/`

**Styles disponibles :** `DCX Shadow`, `DCX Shadow Accent 1–6`

Les styles DCX Shadow appliquent un effet de profondeur (box-shadow + hover translateY) et, pour les variantes accent, une bordure gauche colorée via les variables CSS du thème (`--wp--preset--color--accent-1` à `--wp--preset--color--accent-6`).

**Blocs ciblés :**

| Bloc | Nom technique |
|---|---|
| Groupe | `core/group` |
| Colonnes | `core/columns` |
| Colonne | `core/column` |
| Pile | `core/stack` |
| Grille | `core/grid` |
| DCX Stat Card | `dcx-benchmark-luxe/stat-card` |
| DCX Charts | `dcx-benchmark-luxe/charts` |

Le CSS est chargé en éditeur et en front-end (enqueue global via `wp_enqueue_scripts`).

---

## Documentation

Le dossier `docs/` contient des notes techniques sur des patterns utilisés dans le projet :

- [`docs/dark-mode-theme-json.md`](./docs/dark-mode-theme-json.md) — Dark mode natif avec `light-dark()` + `color-scheme` dans `theme.json`

