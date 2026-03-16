# dcx-benchmark-luxe

Plugin WordPress qui enregistre des blocs Gutenberg React pour les pages benchmark luxe.

## Commandes

```bash
pnpm start         # watch mode (développement, hot-reload)
pnpm build         # build de production dans build/
pnpm lint:js       # lint JavaScript/JSX
pnpm lint:css      # lint SCSS/CSS
```

## Formatage

Le projet utilise **Prettier** via `@wordpress/prettier-config` (tabs, guillemets simples, style WordPress).

La config est déclarée dans `.prettierrc.json` — elle est automatiquement reconnue par les IDE compatibles Prettier (format on save) et par `wp-scripts lint-js`.

```bash
pnpm lint:js --fix   # corrige automatiquement les erreurs de formatage
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
| `accentColor`      | string | `""`    | Couleur de la bordure supérieure d'accent — `var(--wp--preset--color--{slug})` si couleur du thème, sinon hex |
| `accentBorderWidth`| number | `4`     | Épaisseur de la bordure supérieure en px (RangeControl sidebar, 1–20) |
| `numberColor`   | string | `""`    | Couleur du chiffre — `var(--wp--preset--color--{slug})` si couleur du thème, sinon hex |
| `numberFontSize`| string | `""`    | Taille de police du chiffre (FontSizePicker sidebar) |
| `labelColor`    | string | `""`    | Couleur du libellé — `var(--wp--preset--color--{slug})` si couleur du thème, sinon hex |
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

## Versioning et releases

Le projet utilise **[Changesets](https://github.com/changesets/changesets)** pour gérer les versions et **GitHub Actions** pour publier automatiquement les releases.

### Workflow

#### 1. Décrire un changement

```bash
pnpm changeset
# Choisir : patch | minor | major
# Écrire une description du changement
```

Cela crée un fichier dans `.changeset/` à committer avec les modifications.

#### 2. Publication automatique

Au push sur `main`, le workflow GitHub Actions (`release.yml`) tourne sur Node.js 24 :
- S'il y a des changesets en attente → ouvre/met à jour une PR **"Version Packages"**
- À la fusion de cette PR → bumpe la version, build les assets, crée une **GitHub Release** avec le ZIP du plugin

La version est synchronisée automatiquement dans `package.json` **et** dans `dcx-benchmark-luxe-plugin.php` (header `Version:` + constante `DCX_BENCHMARK_LUXE_VERSION`).

### Mise à jour automatique via git-updater

Le plugin est compatible avec **[git-updater](https://github.com/afragen/git-updater)**. Une fois git-updater installé sur un site WordPress, il détecte les nouvelles releases GitHub et propose la mise à jour directement depuis le tableau de bord WordPress.

**Headers git-updater dans `dcx-benchmark-luxe-plugin.php` :**

```
GitHub Plugin URI: NovaGaia/dcx-benchmark-luxe
Primary Branch:    main
Release Asset:     true
```

- `Primary Branch: main` — indique la branche par défaut (obligatoire si ce n'est pas `master`)
- `Release Asset: true` — git-updater télécharge le ZIP attaché à la release GitHub plutôt que l'archive source

**Nommage du ZIP de release :** le fichier doit suivre le pattern `$repo-*.zip`, soit `dcx-benchmark-luxe-{version}.zip` (nom du repo GitHub, pas du dossier plugin).

**Première installation :** git-updater ne gère pas les fresh installs de manière fiable. Installer le plugin manuellement via FTP ou WP-CLI, puis git-updater prend le relais pour les mises à jour suivantes.

**Repo privé :** nécessite une licence payante git-updater + un token GitHub (scope `repo`) configuré dans Settings → Git Updater → GitHub.

---

## Documentation

Le dossier `docs/` contient des notes techniques sur des patterns utilisés dans le projet :

- [`docs/dark-mode-theme-json.md`](./docs/dark-mode-theme-json.md) — Dark mode natif avec `light-dark()` + `color-scheme` dans `theme.json`

