# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Methodologie APEX

Appliquer systematiquement la methode **APEX** pour chaque tache de developpement :

| Phase | Action |
|-------|--------|
| **A**nalyze | Lire/explorer le code concerne, comprendre le contexte et les contraintes |
| **P**lan | Presenter le plan d'action et attendre validation avant d'implementer |
| **E**xecute | Implementer la solution uniquement apres accord |
| e**X**amine | Tester/valider le resultat, verifier qu'il n'y a pas de regression |

### Regles

- Ne jamais coder sans avoir d'abord analyse et planifie
- Toujours attendre la validation du plan avant d'executer
- Toujours verifier le resultat apres implementation

### Commandes de verification (eXamine)

```bash
pnpm build         # build de production — verifie qu'il n'y a pas d'erreur de compilation
pnpm lint:js       # lint JavaScript/JSX
pnpm lint:css      # lint SCSS/CSS
```

## Commands

```bash
pnpm start         # watch mode (développement, hot-reload)
pnpm build         # build de production dans build/
pnpm lint:js       # lint JavaScript/JSX
pnpm lint:css      # lint SCSS/CSS
```

## Architecture

Plugin WordPress dont l'unique responsabilité est d'enregistrer des blocs Gutenberg React.

**Flux de build :**
`src/blocks/<nom-du-bloc>/` → `@wordpress/scripts` (webpack) → `build/blocks/<nom-du-bloc>/`

Le PHP ne fait qu'une seule chose : parcourir `build/blocks/` et appeler `register_block_type()` sur chaque sous-dossier. WordPress lit le `block.json` compilé pour charger automatiquement les scripts et styles.

**Ajouter un nouveau bloc :**
1. Créer `src/blocks/<nom-du-bloc>/` avec `block.json`, `index.js`, `edit.js`, `save.js`, `style.scss`
2. Le nom du bloc dans `block.json` doit suivre le format `dcx-benchmark-luxe/<nom-du-bloc>`
3. Aucune modification PHP requise — la détection est automatique via `glob()`

**Structure d'un bloc :**
- `block.json` — métadonnées (nom, attributs, supports, références aux assets)
- `index.js` — point d'entrée, appel à `registerBlockType()`
- `edit.js` — composant React affiché dans l'éditeur Gutenberg
- `save.js` — rendu statique sérialisé en base de données (ou `null` pour les blocs dynamiques)
- `style.scss` — styles chargés en éditeur **et** en front-end

**Blocs dynamiques (rendu PHP) :** définir `"render": "file:./render.php"` dans `block.json` et retourner `null` dans `save.js`.

## Contraintes importantes

- Le dossier `build/` est gitignored et généré — ne jamais éditer manuellement
- `save.js` est sérialisé : tout changement de structure HTML casse les blocs existants en base (prévoir une [dépréciation](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-deprecation/))
- Text domain : `dcx-benchmark-luxe` (doit correspondre dans `block.json` et les appels `__()`)
