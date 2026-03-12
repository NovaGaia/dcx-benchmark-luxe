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
| `number`        | string | `""`    | Chiffre principal affiché (ex. `"3"`, `"65"`) |
| `suffix`        | string | `""`    | Suffixe optionnel (ex. `"rd"`, `"%"`)       |
| `suffixPosition`| string | `"sup"` | Position du suffixe : `"sup"` (exposant) ou `"sub"` (indice) |
| `label`         | string | `""`    | Libellé descriptif en dessous du chiffre    |
| `accentColor`   | string | `""`    | Couleur de la barre d'accent supérieure (hex, rgb…) |

**Supports WordPress :**
- Bordure (`__experimentalBorder`) : couleur, rayon, largeur, style
- Alignement

**Comportement de la couleur d'accent :**
Quand `accentColor` est défini, une barre colorée de 4 px apparaît en haut de la carte et la classe `has-accent` est ajoutée sur l'élément. Cette classe masque la bordure supérieure via `border-top-color: transparent !important` pour éviter le conflit visuel avec la barre.

**CSS custom properties exposées :**

| Variable             | Valeur quand accent défini | Valeur par défaut |
|----------------------|---------------------------|-------------------|
| `--dcx-stat-accent`  | couleur choisie           | `transparent`     |

**Dépréciations :** `v1` (sans classe `has-accent`), `v2` (avec `borderTopColor` inline).
