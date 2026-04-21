# Columns Reverse Mobile — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter une option "Inverser l'ordre des colonnes sur mobile" dans la sidebar du bloc `core/columns`, qui applique `flex-direction: column-reverse` à ≤ 600px via une classe CSS `has-reverse-on-mobile`.

**Architecture:** Extension Gutenberg (pas un bloc) : trois filtres JS (`blocks.registerBlockType`, `editor.BlockEdit`, `blocks.getSaveContent.extraProps`) + CSS. Le JS est compilé via un entry point webpack custom, puis enqueued manuellement en PHP.

**Tech Stack:** `@wordpress/hooks`, `@wordpress/block-editor`, `@wordpress/components`, `@wordpress/compose`, SCSS, PHP, `@wordpress/scripts` (webpack)

---

## Fichiers

| Action | Chemin | Rôle |
|--------|--------|------|
| Créer | `webpack.config.js` | Étend la config `@wordpress/scripts` avec l'entry extension |
| Créer | `src/extensions/columns-reverse/index.js` | 3 filtres JS : attribut + sidebar + classe CSS |
| Créer | `src/extensions/columns-reverse/style.scss` | CSS mobile `flex-direction: column-reverse` |
| Modifier | `dcx-benchmark-luxe-plugin.php` | 2 fonctions PHP d'enqueue (éditeur + front) |

---

## Task 1 — Webpack config

**Files:**
- Créer : `webpack.config.js`

- [ ] **Vérifier qu'il n'existe pas déjà un `webpack.config.js`**

  ```bash
  ls /Users/renaudheluin/Local\ Sites/dcx-benchmark-luxe/app/public/wp-content/plugins/dcx-benchmark-luxe-plugin/webpack.config.js
  ```
  Résultat attendu : `No such file or directory`

- [ ] **Créer `webpack.config.js`** à la racine du plugin :

  ```js
  const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

  module.exports = {
  	...defaultConfig,
  	entry: {
  		...defaultConfig.entry,
  		'extensions/columns-reverse/index':
  			'./src/extensions/columns-reverse/index.js',
  	},
  };
  ```

- [ ] **Vérifier que le build existant ne casse pas**

  ```bash
  cd "/Users/renaudheluin/Local Sites/dcx-benchmark-luxe/app/public/wp-content/plugins/dcx-benchmark-luxe-plugin" && pnpm build
  ```
  Résultat attendu : 0 erreur, les blocs existants sont toujours dans `build/blocks/`.

- [ ] **Commit**

  Utiliser le skill `git-commit` avec le message :
  ```
  build: add webpack entry for columns-reverse extension
  ```

---

## Task 2 — SCSS mobile

**Files:**
- Créer : `src/extensions/columns-reverse/style.scss`

- [ ] **Créer le dossier et le fichier SCSS** :

  ```scss
  @media (max-width: 600px) {
  	.wp-block-columns.has-reverse-on-mobile {
  		flex-direction: column-reverse;
  	}
  }
  ```

  Chemin : `src/extensions/columns-reverse/style.scss`

- [ ] **Commit**

  Utiliser le skill `git-commit` avec le message :
  ```
  feat: add mobile reverse style for core/columns
  ```

---

## Task 3 — Filtres JS

**Files:**
- Créer : `src/extensions/columns-reverse/index.js`

- [ ] **Créer `src/extensions/columns-reverse/index.js`** :

  ```js
  import { __ } from '@wordpress/i18n';
  import { addFilter } from '@wordpress/hooks';
  import { InspectorControls } from '@wordpress/block-editor';
  import { PanelBody, ToggleControl } from '@wordpress/components';
  import { createHigherOrderComponent } from '@wordpress/compose';
  import './style.scss';

  addFilter(
  	'blocks.registerBlockType',
  	'dcx/columns-reverse-attribute',
  	( settings, name ) => {
  		if ( name !== 'core/columns' ) return settings;
  		return {
  			...settings,
  			attributes: {
  				...settings.attributes,
  				reverseOnMobile: { type: 'boolean', default: false },
  			},
  		};
  	}
  );

  const withColumnsReverseControl = createHigherOrderComponent(
  	( BlockEdit ) => {
  		return ( props ) => {
  			if ( props.name !== 'core/columns' ) {
  				return <BlockEdit { ...props } />;
  			}
  			const { attributes, setAttributes } = props;
  			return (
  				<>
  					<BlockEdit { ...props } />
  					<InspectorControls>
  						<PanelBody
  							title={ __( 'Mobile', 'dcx-benchmark-luxe' ) }
  							initialOpen={ false }
  						>
  							<ToggleControl
  								label={ __(
  									"Inverser l'ordre des colonnes sur mobile",
  									'dcx-benchmark-luxe'
  								) }
  								checked={ !! attributes.reverseOnMobile }
  								onChange={ ( value ) =>
  									setAttributes( { reverseOnMobile: value } )
  								}
  							/>
  						</PanelBody>
  					</InspectorControls>
  				</>
  			);
  		};
  	},
  	'withColumnsReverseControl'
  );

  addFilter(
  	'editor.BlockEdit',
  	'dcx/columns-reverse-control',
  	withColumnsReverseControl
  );

  addFilter(
  	'blocks.getSaveContent.extraProps',
  	'dcx/columns-reverse-class',
  	( extraProps, blockType, attributes ) => {
  		if ( blockType.name !== 'core/columns' ) return extraProps;
  		if ( ! attributes.reverseOnMobile ) return extraProps;
  		return {
  			...extraProps,
  			className: [ extraProps.className, 'has-reverse-on-mobile' ]
  				.filter( Boolean )
  				.join( ' ' ),
  		};
  	}
  );
  ```

- [ ] **Builder et vérifier**

  ```bash
  cd "/Users/renaudheluin/Local Sites/dcx-benchmark-luxe/app/public/wp-content/plugins/dcx-benchmark-luxe-plugin" && pnpm build
  ```
  Résultat attendu : présence de `build/extensions/columns-reverse/index.js`, `build/extensions/columns-reverse/index.css` et `build/extensions/columns-reverse/index.asset.php`.

  ```bash
  ls "/Users/renaudheluin/Local Sites/dcx-benchmark-luxe/app/public/wp-content/plugins/dcx-benchmark-luxe-plugin/build/extensions/columns-reverse/"
  ```
  Résultat attendu : `index.asset.php  index.css  index.js`

- [ ] **Lint JS**

  ```bash
  cd "/Users/renaudheluin/Local Sites/dcx-benchmark-luxe/app/public/wp-content/plugins/dcx-benchmark-luxe-plugin" && pnpm lint:js src/extensions/columns-reverse/index.js
  ```
  Résultat attendu : 0 erreur.

- [ ] **Lint CSS**

  ```bash
  cd "/Users/renaudheluin/Local Sites/dcx-benchmark-luxe/app/public/wp-content/plugins/dcx-benchmark-luxe-plugin" && pnpm lint:css src/extensions/columns-reverse/style.scss
  ```
  Résultat attendu : 0 erreur.

- [ ] **Commit**

  Utiliser le skill `git-commit` avec le message :
  ```
  feat: add columns-reverse extension JS filters
  ```

---

## Task 4 — Enqueue PHP

**Files:**
- Modifier : `dcx-benchmark-luxe-plugin.php` (ajouter à la fin du fichier, avant la dernière ligne si elle existe)

- [ ] **Ajouter les deux fonctions d'enqueue** à la fin de `dcx-benchmark-luxe-plugin.php` :

  ```php
  /**
   * Enregistre le script et le style de l'extension columns-reverse dans l'éditeur.
   */
  function dcx_benchmark_luxe_enqueue_columns_reverse_editor() {
  	$asset_file = DCX_BENCHMARK_LUXE_PLUGIN_DIR . 'build/extensions/columns-reverse/index.asset.php';
  	if ( ! file_exists( $asset_file ) ) {
  		return;
  	}
  	$asset = include $asset_file;

  	wp_enqueue_script(
  		'dcx-columns-reverse-editor',
  		DCX_BENCHMARK_LUXE_PLUGIN_URL . 'build/extensions/columns-reverse/index.js',
  		$asset['dependencies'],
  		$asset['version'],
  		true
  	);

  	wp_enqueue_style(
  		'dcx-columns-reverse-editor-style',
  		DCX_BENCHMARK_LUXE_PLUGIN_URL . 'build/extensions/columns-reverse/index.css',
  		[],
  		$asset['version']
  	);
  }
  add_action( 'enqueue_block_editor_assets', 'dcx_benchmark_luxe_enqueue_columns_reverse_editor' );

  /**
   * Enregistre le style de l'extension columns-reverse en front-end.
   */
  function dcx_benchmark_luxe_enqueue_columns_reverse_style() {
  	$asset_file = DCX_BENCHMARK_LUXE_PLUGIN_DIR . 'build/extensions/columns-reverse/index.asset.php';
  	if ( ! file_exists( $asset_file ) ) {
  		return;
  	}
  	$asset = include $asset_file;

  	wp_enqueue_style(
  		'dcx-columns-reverse-style',
  		DCX_BENCHMARK_LUXE_PLUGIN_URL . 'build/extensions/columns-reverse/index.css',
  		[],
  		$asset['version']
  	);
  }
  add_action( 'wp_enqueue_scripts', 'dcx_benchmark_luxe_enqueue_columns_reverse_style' );
  ```

- [ ] **Vérifier la syntaxe PHP**

  ```bash
  php -l "/Users/renaudheluin/Local Sites/dcx-benchmark-luxe/app/public/wp-content/plugins/dcx-benchmark-luxe-plugin/dcx-benchmark-luxe-plugin.php"
  ```
  Résultat attendu : `No syntax errors detected`

- [ ] **Commit**

  Utiliser le skill `git-commit` avec le message :
  ```
  feat: enqueue columns-reverse extension in editor and front-end
  ```

---

## Task 5 — Vérification manuelle

- [ ] **Dans l'éditeur Gutenberg :** insérer un bloc `core/columns`, le sélectionner → vérifier qu'un panneau "Mobile" apparaît dans la sidebar avec le toggle "Inverser l'ordre des colonnes sur mobile".

- [ ] **Activer le toggle** → sauvegarder la page → inspecter le HTML en front-end et vérifier que le wrapper du bloc contient la classe `has-reverse-on-mobile`.

  ```html
  <!-- Attendu : -->
  <div class="wp-block-columns has-reverse-on-mobile">
  ```

- [ ] **Redimensionner le navigateur à ≤ 600px** (ou DevTools mobile) → vérifier visuellement que les colonnes s'inversent.

- [ ] **Désactiver le toggle** → sauvegarder → vérifier que la classe disparaît du HTML.
