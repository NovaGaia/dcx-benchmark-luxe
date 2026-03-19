# dcx-benchmark-luxe

Plugin WordPress qui enregistre des blocs Gutenberg React pour les pages benchmark luxe.

## Commandes

```bash
# Installation (première fois)
composer install   # dépendances PHP (plugin-update-checker)
pnpm install       # dépendances JS

# Développement
pnpm start         # watch mode (hot-reload)
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

Graphique de données (barres horizontales ou camembert) avec bouton insight ouvrant une modale. Les couleurs sont configurables via la page de réglages admin.

**Fichiers :** `src/blocks/charts/`

**Page de réglages :** Settings → DCX Benchmark Luxe (dans l'admin WordPress)

**Option WordPress :** `dcx_benchmark_luxe_bar_colors` (tableau de codes hex)

**Couleurs par défaut :** `#1a2b4a`, `#4cb8c4`, `#5c6bc0`, `#e57373`, `#9e9e9e`

Les couleurs sont passées à l'éditeur Gutenberg via `wp_localize_script` sous l'objet `dcxBarChartSettings.barColors`.

---

### `dcx-benchmark-luxe/core-styles`

Bloc interne (non visible dans l'inserter) qui enregistre des **Block Styles** pour les blocs core et les blocs custom du plugin.

**Fichiers :** `src/blocks/core-styles/`

**Styles disponibles :** `DCX Shadow`, et une variante par couleur de la palette du `theme.json`

Les styles DCX Shadow appliquent un effet de profondeur (box-shadow + hover translateY) et, pour les variantes colorées, une bordure gauche via les variables CSS du thème (`--wp--preset--color--{slug}`).

**Couleurs disponibles** (tirées du `theme.json` du thème) :

| Slug | Nom |
|------|-----|
| `accent-1` … `accent-5` | Accents 1 à 5 |
| `custom-secondary-1` … `custom-secondary-5` | Secondaires 1 à 5 |
| `custom-digit-1`, `custom-digit-2` | Digit 1, Digit 2 |
| `contrast` | Contraste |

> Pour ajouter une couleur : l'ajouter dans `theme.json` du thème **et** dans la liste `$dcx-color-slugs` de `style.scss` + le tableau `boxStyles` de `index.js`, puis rebuilder.

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
| DCX CTA | `dcx-benchmark-luxe/cta` |

Le CSS est chargé en éditeur et en front-end (enqueue global via `wp_enqueue_scripts`).

---

### `dcx-benchmark-luxe/podium-cards`

Podium à 3 cartes (1ère, 2ème, 3ème place) avec nom, score et description éditables en ligne.

**Fichiers :** `src/blocks/podium-cards/`

**Attributs :**

| Attribut       | Type   | Défaut        | Description                  |
|----------------|--------|---------------|------------------------------|
| `name1`        | string | `"Maison A"`  | Nom — 1ère place             |
| `score1`       | string | `"97/100"`    | Score — 1ère place           |
| `description1` | string | `"Description…"` | Description — 1ère place  |
| `name2`        | string | `"Maison B"`  | Nom — 2ème place             |
| `score2`       | string | `"94/100"`    | Score — 2ème place           |
| `description2` | string | `"Description…"` | Description — 2ème place  |
| `name3`        | string | `"Maison C"`  | Nom — 3ème place             |
| `score3`       | string | `"91/100"`    | Score — 3ème place           |
| `description3` | string | `"Description…"` | Description — 3ème place  |

**Supports WordPress :**
- Spacing : `margin` et `padding` (controls désactivés par défaut dans la sidebar)

**Édition inline :** tous les champs (nom, score, description) s'éditent directement dans le canvas via `RichText` (sans formatage autorisé).

**Responsive :** en dessous de 600 px, les cartes s'empilent verticalement — la 1ère place remonte en tête de liste, le décalage `translateY` est supprimé.

**Données fixes par rang :**

| Rang | Médaille | Couleur accent |
|------|----------|----------------|
| 1ère | 🥇 | `#F2C94C` (or) |
| 2ème | 🥈 | `#B0BEC5` (argent) |
| 3ème | 🥉 | `#CD7F32` (bronze) |

---

### `dcx-benchmark-luxe/blurred-section`

Conteneur masquant son contenu avec un effet de flou progressif et un overlay CTA ouvrant une modal HubSpot. Idéal pour du contenu "paywall" accessible après soumission de formulaire.

**Fichiers :** `src/blocks/blurred-section/`

**Attributs :**

| Attribut             | Type    | Défaut                                          | Description |
|----------------------|---------|-------------------------------------------------|-------------|
| `overlayTitle`       | string  | `"Envie d'en savoir plus ?"`                    | Titre de l'overlay (RichText inline, bold/italic autorisés) |
| `overlayDescription` | string  | `"Accédez au contenu complet en remplissant le formulaire."` | Description de l'overlay (RichText inline) |
| `buttonText`         | string  | `"Accéder au contenu"`                          | Texte du bouton CTA (RichText inline) |
| `buttonIcon`         | string  | `"🔓"`                                          | Emoji/icône du bouton |
| `iframeUrl`          | string  | `""`                                            | URL du formulaire HubSpot affiché dans la modal |
| `overlayHeight`      | number  | `50`                                            | Hauteur de l'overlay en % (20–80) |
| `gradientColor`      | string  | `"#ffffff"`                                     | Couleur de fond du fondu (ColorPalette sidebar) |
| `blurIntensity`      | number  | `6`                                             | Intensité du flou en px (2–12) |
| `minHeight`          | string  | `"300px"`                                       | Hauteur minimale du bloc (ex. `300px`, `20rem`) |
| `maxHeight`          | string  | `"500px"`                                       | Hauteur maximale — coupe le contenu qui dépasse |
| `showBlurPreview`    | boolean | `false`                                         | Active la prévisualisation du flou dans l'éditeur |

**Supports WordPress :**
- Alignement : `wide`, `full`
- Spacing : `margin`, `padding`

**Fonctionnement :**
- En éditeur : un bandeau avertit que le contenu sera flouté. L'`InnerBlocks` permet d'éditer librement le contenu ; l'overlay CTA s'affiche en flux sous le contenu. Le `ToggleControl` "Prévisualiser le flou" applique le rendu front-end directement dans le canvas.
- En front-end : le contenu est masqué par un `backdrop-filter: blur()` progressif (gradient mask). L'overlay CTA s'affiche en superposition. Le bouton ouvre une modal contenant l'iframe HubSpot.

**Modal HubSpot :**
La modal est gérée par `view.js` (déplacée vers `document.body` pour échapper aux stacking contexts). Elle s'ouvre via le bouton CTA, se ferme via la croix, le fond semi-transparent, ou la touche `Escape`. Le focus est géré pour l'accessibilité.

**CSS appliqués en inline (save.js) :**

| Style | Description |
|-------|-------------|
| `backdropFilter` / `WebkitBackdropFilter` | Flou du contenu |
| `maskImage` / `WebkitMaskImage` | Gradient `transparent → black` contrôlant la zone floutée |
| `background` (overlay) | Fondu `gradientColor → transparent` |

---

### `dcx-benchmark-luxe/cta`

Encart Call-to-Action centré avec titre, texte descriptif et bouton lien.

**Fichiers :** `src/blocks/cta/`

**Attributs :**

| Attribut             | Type    | Défaut                             | Description |
|----------------------|---------|------------------------------------|-------------|
| `title`              | string  | `"Vous souhaitez aller plus loin ?"` | Titre (RichText inline, bold/italic autorisés) |
| `description`        | string  | `"Recevez la fiche complète…"`     | Description (RichText inline, bold/italic autorisés) |
| `buttonText`         | string  | `"En savoir plus"`                 | Texte du bouton (RichText inline) |
| `buttonUrl`          | string  | `""`                               | URL de destination |
| `buttonIcon`         | string  | `"✉️"`                              | Emoji/icône affiché avant le texte du bouton |
| `linkTarget`         | boolean | `false`                            | Ouvrir dans un nouvel onglet (`target="_blank"`) |
| `titleColor`         | string  | `""`                               | Couleur du titre (ColorPalette sidebar) |
| `titleFontSize`      | string  | `""`                               | Taille de police du titre (FontSizePicker sidebar) |
| `descriptionColor`   | string  | `""`                               | Couleur de la description (ColorPalette sidebar) |
| `descriptionFontSize`| string  | `""`                               | Taille de police de la description (FontSizePicker sidebar) |

**Supports WordPress :**
- Couleur : fond, texte, dégradés
- Spacing : `margin`, `padding`, `blockGap` (espacement entre les éléments via les presets du `theme.json`)
- Ombre (`shadow`)
- Bordure (`__experimentalBorder`) : couleur, rayon, largeur, style

**Espacement entre éléments (`blockGap`) :**
WordPress stocke la valeur en format interne `var:preset|spacing|60`. Le bloc la convertit en CSS valide (`var(--wp--preset--spacing--60)`) puis l'injecte comme `--wp--style--block-gap` sur le wrapper. Le SCSS lit `gap: var(--wp--style--block-gap, 1.5rem)`.

**Bouton :**
Le bouton utilise toujours les classes `wp-block-button__link wp-element-button`, encapsulées dans la structure native `wp-block-buttons`. Le style est donc entièrement piloté par le thème.

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

### Mise à jour automatique via plugin-update-checker

Le plugin embarque **[plugin-update-checker](https://github.com/YahnisElsts/plugin-update-checker)** (PUC) — aucun plugin tiers à installer sur le site WordPress. PUC détecte les nouvelles releases GitHub et propose la mise à jour directement depuis le tableau de bord WordPress.

**Aucune configuration requise côté WordPress.** PUC est initialisé automatiquement au chargement du plugin et pointe vers les releases GitHub publiques.

**Nommage du ZIP de release :** le fichier doit suivre le pattern `dcx-benchmark-luxe-{version}.zip` pour être détecté par PUC comme asset de release.

**Première installation :** installer le plugin manuellement via FTP ou WP-CLI. PUC prend le relais pour toutes les mises à jour suivantes.

---

## Documentation

Le dossier `docs/` contient des notes techniques sur des patterns utilisés dans le projet :

- [`docs/dark-mode-theme-json.md`](./docs/dark-mode-theme-json.md) — Dark mode natif avec `light-dark()` + `color-scheme` dans `theme.json`

