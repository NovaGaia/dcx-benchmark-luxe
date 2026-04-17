<?php
/**
 * Plugin Name: DCX Benchmark Luxe
 * Plugin URI:  https://github.com/NovaGaia/dcx-benchmark-luxe
 * Description: Blocs Gutenberg pour DCX Benchmark Luxe.
 * Version:     1.4.0
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

define( 'DCX_BENCHMARK_LUXE_VERSION', '1.4.0' );

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
 * Charge les styles globaux (block styles pour blocs core) en front-end.
 */
function dcx_benchmark_luxe_enqueue_global_styles() {
	$css_file = DCX_BENCHMARK_LUXE_PLUGIN_DIR . 'build/blocks/core-styles/style-index.css';

	if ( file_exists( $css_file ) ) {
		wp_enqueue_style(
			'dcx-benchmark-luxe-core-styles',
			DCX_BENCHMARK_LUXE_PLUGIN_URL . 'build/blocks/core-styles/style-index.css',
			[],
			filemtime( $css_file )
		);
	}
}
add_action( 'wp_enqueue_scripts', 'dcx_benchmark_luxe_enqueue_global_styles' );

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
