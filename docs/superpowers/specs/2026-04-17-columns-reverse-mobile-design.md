# Spec — Inversion de l'ordre des colonnes sur mobile

**Date :** 2026-04-17  
**Bloc cible :** `core/columns` (natif Gutenberg)  
**Breakpoint :** `≤ 600px` (aligné sur le breakpoint natif de `core/columns`)

---

## Objectif

Ajouter une option dans la sidebar de l'éditeur Gutenberg pour que le rédacteur puisse activer, sur le bloc `core/columns`, un renversement de l'ordre des colonnes sur mobile via `flex-direction: column-reverse`.

---

## Architecture

L'extension est un **script éditeur + feuille de style**, séparé des blocs existants. Elle n'est pas un bloc et n'a pas de `block.json`.

### Nouveaux fichiers

```
src/extensions/columns-reverse/
├── index.js        # Filtres JS (attribut + sidebar + classe CSS)
└── style.scss      # CSS front-end et éditeur (≤600px)

webpack.config.js   # Étend la config @wordpress/scripts avec l'entry extension
```

### Fichier PHP modifié

`dcx-benchmark-luxe-plugin.php` — ajout de deux fonctions d'enqueue :
- `dcx_benchmark_luxe_enqueue_columns_reverse_editor()` sur `enqueue_block_editor_assets` — charge le JS compilé + dépendances WordPress (`wp-hooks`, `wp-blocks`, `wp-components`, `wp-block-editor`, `wp-i18n`, `wp-element`)
- `dcx_benchmark_luxe_enqueue_columns_reverse_style()` sur `wp_enqueue_scripts` — charge le CSS compilé en front-end

---

## Détail de `index.js`

### 1. Ajout de l'attribut sur `core/columns`

```js
addFilter('blocks.registerBlockType', 'dcx/columns-reverse-attribute', (settings, name) => {
  if (name !== 'core/columns') return settings;
  return {
    ...settings,
    attributes: {
      ...settings.attributes,
      reverseOnMobile: { type: 'boolean', default: false },
    },
  };
});
```

### 2. Contrôle sidebar

```js
addFilter('editor.BlockEdit', 'dcx/columns-reverse-control', (BlockEdit) => {
  return (props) => {
    if (props.name !== 'core/columns') return <BlockEdit {...props} />;
    return (
      <>
        <BlockEdit {...props} />
        <InspectorControls>
          <PanelBody title={__('Mobile', 'dcx-benchmark-luxe')} initialOpen={false}>
            <ToggleControl
              label={__('Inverser l\'ordre des colonnes sur mobile', 'dcx-benchmark-luxe')}
              checked={props.attributes.reverseOnMobile}
              onChange={(value) => props.setAttributes({ reverseOnMobile: value })}
            />
          </PanelBody>
        </InspectorControls>
      </>
    );
  };
});
```

### 3. Injection de la classe CSS

```js
addFilter('blocks.getSaveContent.extraProps', 'dcx/columns-reverse-class', (extraProps, blockType, attributes) => {
  if (blockType.name !== 'core/columns') return extraProps;
  if (!attributes.reverseOnMobile) return extraProps;
  return {
    ...extraProps,
    className: [extraProps.className, 'has-reverse-on-mobile'].filter(Boolean).join(' '),
  };
});
```

---

## Détail de `style.scss`

```scss
@media (max-width: 600px) {
  .wp-block-columns.has-reverse-on-mobile {
    flex-direction: column-reverse;
  }
}
```

Chargé en front-end via `wp_enqueue_scripts` et en éditeur via `enqueue_block_editor_assets`.

---

## `webpack.config.js`

Étend la configuration par défaut de `@wordpress/scripts` pour ajouter l'extension comme entry point supplémentaire :

```js
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = {
  ...defaultConfig,
  entry: {
    ...defaultConfig.entry,
    'extensions/columns-reverse/index': './src/extensions/columns-reverse/index.js',
  },
};
```

Les assets compilés atterrissent dans `build/extensions/columns-reverse/`.

---

## Comportement attendu

- Sur desktop : aucun changement visuel, l'option est ignorée.
- Sur mobile (≤ 600px) avec l'option activée : les colonnes s'affichent dans l'ordre inverse via `flex-direction: column-reverse`.
- Dans l'éditeur : le `ToggleControl` "Inverser l'ordre des colonnes sur mobile" apparaît dans le panneau "Mobile" de la sidebar quand un bloc `core/columns` est sélectionné.
- La classe `has-reverse-on-mobile` est sérialisée en base de données avec le bloc.

---

## Contraintes

- `core/columns` est un bloc dont le HTML est sérialisé — l'injection de classe via `getSaveContent.extraProps` modifie le HTML sauvegardé. Si on retire l'extension, les blocs existants garderont la classe mais le style ne sera plus appliqué (dégradation gracieuse).
- Pas de dépréciation nécessaire : on ajoute une classe optionnelle sans modifier la structure HTML existante.
