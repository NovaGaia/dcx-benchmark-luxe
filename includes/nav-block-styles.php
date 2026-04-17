<?php
/**
 * Enregistre le block style nav-internal et ses assets conditionnels.
 *
 * @package DCX_Benchmark_Luxe
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function dcx_benchmark_luxe_register_nav_block_styles(): void {
	wp_register_style(
		'dcx-benchmark-luxe-nav-base',
		DCX_BENCHMARK_LUXE_PLUGIN_URL . 'assets/css/nav-base.css',
		[],
		DCX_BENCHMARK_LUXE_VERSION
	);

	wp_register_style(
		'dcx-benchmark-luxe-nav-internal',
		DCX_BENCHMARK_LUXE_PLUGIN_URL . 'assets/css/nav-internal.css',
		[],
		DCX_BENCHMARK_LUXE_VERSION
	);

	wp_register_script(
		'dcx-benchmark-luxe-nav-internal',
		DCX_BENCHMARK_LUXE_PLUGIN_URL . 'assets/js/nav-internal.js',
		[],
		DCX_BENCHMARK_LUXE_VERSION,
		array( 'strategy' => 'defer' )
	);

	register_block_style(
		'core/navigation',
		array(
			'name'         => 'nav-internal',
			'label'        => __( 'Navigation interne', 'dcx-benchmark-luxe' ),
			'style_handle' => 'dcx-benchmark-luxe-nav-internal',
		)
	);
}
add_action( 'init', 'dcx_benchmark_luxe_register_nav_block_styles' );

/**
 * Enqueue nav-internal.js conditionnellement quand is-style-nav-internal est présent.
 *
 * @param string $block_content Contenu HTML rendu du bloc.
 * @param array  $block         Données du bloc parsé.
 * @return string Contenu inchangé.
 */
function dcx_benchmark_luxe_maybe_enqueue_nav_internal_script( string $block_content, array $block ): string {
	if ( ( $block['blockName'] ?? '' ) !== 'core/navigation' ) {
		return $block_content;
	}

	if ( str_contains( $block_content, 'is-style-nav-internal' ) ) {
		wp_enqueue_style( 'dcx-benchmark-luxe-nav-internal' );
		wp_enqueue_script( 'dcx-benchmark-luxe-nav-internal' );
	}

	return $block_content;
}
add_filter( 'render_block', 'dcx_benchmark_luxe_maybe_enqueue_nav_internal_script', 20, 2 );
