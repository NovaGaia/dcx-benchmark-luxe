<?php
/**
 * Plugin Name: DCX Benchmark Luxe
 * Plugin URI:  https://example.com/dcx-benchmark-luxe
 * Description: Blocs Gutenberg pour DCX Benchmark Luxe.
 * Version:     1.0.0
 * Author:      DCX
 * Author URI:  https://example.com
 * License:     GPL-2.0+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: dcx-benchmark-luxe
 * Domain Path: /languages
 *
 * @package DCX_Benchmark_Luxe
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'DCX_BENCHMARK_LUXE_VERSION', '1.0.0' );
define( 'DCX_BENCHMARK_LUXE_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'DCX_BENCHMARK_LUXE_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

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
