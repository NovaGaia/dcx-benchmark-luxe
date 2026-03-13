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
| `accentColor`   | string | `""`    | Couleur de la barre d'accent supérieure (hex, rgb…) |
| `numberColor`   | string | `""`    | Couleur du chiffre (ColorPalette sidebar)   |
| `numberFontSize`| string | `""`    | Taille de police du chiffre (FontSizePicker sidebar) |
| `labelColor`    | string | `""`    | Couleur du libellé (ColorPalette sidebar)   |
| `labelFontSize` | string | `""`    | Taille de police du libellé (FontSizePicker sidebar) |

**Supports WordPress :**
- Bordure (`__experimentalBorder`) : couleur, rayon, largeur, style
- Alignement

**Édition inline :** `number` et `label` s'éditent directement dans le canvas Gutenberg via `RichText` (sans formatage autorisé). `suffix` et `suffixPosition` restent dans la sidebar.

**Comportement de la couleur d'accent :**
Quand `accentColor` est défini, une barre colorée de 4 px apparaît en haut de la carte et la classe `has-accent` est ajoutée sur l'élément. Cette classe masque la bordure supérieure via `border-top-color: transparent !important` pour éviter le conflit visuel avec la barre.

**CSS custom properties exposées :**

| Variable             | Valeur quand accent défini | Valeur par défaut |
|----------------------|---------------------------|-------------------|
| `--dcx-stat-accent`  | couleur choisie           | `transparent`     |

---

## Documentation

Le dossier `docs/` contient des notes techniques sur des patterns utilisés dans le projet :

- [`docs/dark-mode-theme-json.md`](./docs/dark-mode-theme-json.md) — Dark mode natif avec `light-dark()` + `color-scheme` dans `theme.json`

