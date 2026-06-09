<?php
/**
 * Plugin Name: DCX Benchmark Luxe
 * Plugin URI:  https://github.com/NovaGaia/dcx-benchmark-luxe
 * Description: Blocs Gutenberg pour DCX Benchmark Luxe.
 * Version:     1.9.0
 * Author:      DCX
 * Author URI:  https://example.com
 * License:     GPL-2.0+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: dcx-benchmark-luxe
 * Domain Path: /languages
 * Requires WP:       6.3
 * Requires PHP:      8.0
 *
 * @package DCX_Benchmark_Luxe
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'DCX_BENCHMARK_LUXE_VERSION', '1.9.0' );

// Mises à jour automatiques via GitHub Releases (plugin-update-checker).
if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	require_once __DIR__ . '/vendor/autoload.php';

	$update_checker = YahnisElsts\PluginUpdateChecker\v5\PucFactory::buildUpdateChecker(
		'https://github.com/NovaGaia/dcx-benchmark-luxe',
		__FILE__,
		'dcx-benchmark-luxe-plugin'
	);
	$update_checker->getVcsApi()->enableReleaseAssets();
}
define( 'DCX_BENCHMARK_LUXE_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'DCX_BENCHMARK_LUXE_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

require_once DCX_BENCHMARK_LUXE_PLUGIN_DIR . 'includes/settings.php';
require_once DCX_BENCHMARK_LUXE_PLUGIN_DIR . 'includes/nav-filters.php';
require_once DCX_BENCHMARK_LUXE_PLUGIN_DIR . 'includes/nav-block-styles.php';

/**
 * Enregistre tous les blocs du plugin.
 * Chaque bloc est détecté automatiquement via son block.json.
 */
function dcx_benchmark_luxe_register_blocks() {
	$blocks_dir = DCX_BENCHMARK_LUXE_PLUGIN_DIR . 'build/blocks/';

	if ( ! is_dir( $blocks_dir ) ) {
		return;
	}

	foreach ( glob( $blocks_dir . '*', GLOB_ONLYDIR ) as $block_dir ) {
		register_block_type( $block_dir );
	}
}
add_action( 'init', 'dcx_benchmark_luxe_register_blocks' );

/**
 * Charge les styles core/button à priorité 1, AVANT wp_add_global_styles_for_blocks() (priorité 10).
 * WordPress n'injecte le CSS de bloc (couleur, rayon, ombre depuis theme.json) que si
 * wp-block-button est déjà dans la queue au moment du check dans wp_add_global_styles_for_blocks().
 */
function dcx_benchmark_luxe_enqueue_button_styles() {
	wp_enqueue_style( 'wp-block-button' );
	wp_enqueue_style( 'wp-block-buttons' );
}
add_action( 'wp_enqueue_scripts', 'dcx_benchmark_luxe_enqueue_button_styles', 1 );

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
		DCX_BENCHMARK_LUXE_PLUGIN_URL . 'build/extensions/columns-reverse/style-index.css',
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
		DCX_BENCHMARK_LUXE_PLUGIN_URL . 'build/extensions/columns-reverse/style-index.css',
		[],
		$asset['version']
	);
}
add_action( 'wp_enqueue_scripts', 'dcx_benchmark_luxe_enqueue_columns_reverse_style' );

/**
 * Enregistre le script de l'extension scroll-shadow dans l'éditeur.
 */
function dcx_benchmark_luxe_enqueue_scroll_shadow_editor() {
	$asset_file = DCX_BENCHMARK_LUXE_PLUGIN_DIR . 'build/extensions/scroll-shadow/index.asset.php';
	if ( ! file_exists( $asset_file ) ) {
		return;
	}
	$asset = include $asset_file;

	wp_enqueue_script(
		'dcx-scroll-shadow-editor',
		DCX_BENCHMARK_LUXE_PLUGIN_URL . 'build/extensions/scroll-shadow/index.js',
		$asset['dependencies'],
		$asset['version'],
		true
	);
}
add_action( 'enqueue_block_editor_assets', 'dcx_benchmark_luxe_enqueue_scroll_shadow_editor' );

/**
 * Enregistre le script et le style de l'extension scroll-shadow en front-end.
 */
function dcx_benchmark_luxe_enqueue_scroll_shadow_front() {
	$view_asset_file  = DCX_BENCHMARK_LUXE_PLUGIN_DIR . 'build/extensions/scroll-shadow/view.asset.php';
	$index_asset_file = DCX_BENCHMARK_LUXE_PLUGIN_DIR . 'build/extensions/scroll-shadow/index.asset.php';
	if ( ! file_exists( $view_asset_file ) || ! file_exists( $index_asset_file ) ) {
		return;
	}
	$view_asset  = include $view_asset_file;
	$index_asset = include $index_asset_file;

	wp_enqueue_script(
		'dcx-scroll-shadow-view',
		DCX_BENCHMARK_LUXE_PLUGIN_URL . 'build/extensions/scroll-shadow/view.js',
		$view_asset['dependencies'],
		$view_asset['version'],
		true
	);

	wp_enqueue_style(
		'dcx-scroll-shadow-style',
		DCX_BENCHMARK_LUXE_PLUGIN_URL . 'build/extensions/scroll-shadow/style-index.css',
		[],
		$index_asset['version']
	);
}
add_action( 'wp_enqueue_scripts', 'dcx_benchmark_luxe_enqueue_scroll_shadow_front' );

/**
 * Enregistre le script de l'extension button-popup dans l'éditeur.
 */
function dcx_benchmark_luxe_enqueue_button_popup_editor() {
	$asset_file = DCX_BENCHMARK_LUXE_PLUGIN_DIR . 'build/extensions/button-popup/index.asset.php';
	if ( ! file_exists( $asset_file ) ) {
		return;
	}
	$asset = include $asset_file;

	wp_enqueue_script(
		'dcx-button-popup-editor',
		DCX_BENCHMARK_LUXE_PLUGIN_URL . 'build/extensions/button-popup/index.js',
		$asset['dependencies'],
		$asset['version'],
		true
	);

	wp_enqueue_style(
		'dcx-button-popup-editor-style',
		DCX_BENCHMARK_LUXE_PLUGIN_URL . 'build/extensions/button-popup/style-index.css',
		[],
		$asset['version']
	);
}
add_action( 'enqueue_block_editor_assets', 'dcx_benchmark_luxe_enqueue_button_popup_editor' );

/**
 * Enregistre le script et le style de l'extension button-popup en front-end.
 */
function dcx_benchmark_luxe_enqueue_button_popup_front() {
	$index_asset_file = DCX_BENCHMARK_LUXE_PLUGIN_DIR . 'build/extensions/button-popup/index.asset.php';
	$view_asset_file  = DCX_BENCHMARK_LUXE_PLUGIN_DIR . 'build/extensions/button-popup/view.asset.php';
	if ( ! file_exists( $index_asset_file ) || ! file_exists( $view_asset_file ) ) {
		return;
	}
	$index_asset = include $index_asset_file;
	$view_asset  = include $view_asset_file;

	wp_enqueue_script(
		'dcx-button-popup-view',
		DCX_BENCHMARK_LUXE_PLUGIN_URL . 'build/extensions/button-popup/view.js',
		$view_asset['dependencies'],
		$view_asset['version'],
		true
	);

	wp_enqueue_style(
		'dcx-button-popup-style',
		DCX_BENCHMARK_LUXE_PLUGIN_URL . 'build/extensions/button-popup/style-index.css',
		[],
		$index_asset['version']
	);
}
add_action( 'wp_enqueue_scripts', 'dcx_benchmark_luxe_enqueue_button_popup_front' );
