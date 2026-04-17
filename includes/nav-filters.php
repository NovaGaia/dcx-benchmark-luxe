<?php
/**
 * Injecte les CSS custom properties des items de navigation sur le <nav> rendu.
 *
 * @package DCX_Benchmark_Luxe
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Convertit le format interne WP `var:preset|TYPE|SLUG` en CSS valide `var(--wp--preset--TYPE--SLUG)`.
 *
 * @param string $value Valeur potentiellement en format interne WP.
 * @return string Valeur avec les références de preset résolues en CSS valide.
 */
function dcx_resolve_wp_preset_var( string $value ): string {
	return preg_replace(
		'/var:preset\|([^|\s]+)\|([^|\s;]+)/',
		'var(--wp--preset--$1--$2)',
		$value
	);
}

/**
 * File d'attente des valeurs border/padding interceptées pour chaque bloc core/navigation.
 * Alimentée par dcx_nav_strip_border_data (render_block_data, prio 5) et
 * consommée par dcx_nav_inject_item_styles (render_block, prio 10).
 *
 * @var array[]
 */
$GLOBALS['dcx_nav_border_queue'] = [];

/**
 * Retire style.border et style.spacing.padding des attrs avant que WP's block
 * supports les lisent et génèrent du CSS de classe sur le <nav>.
 *
 * @param array $parsed_block Bloc parsé avant rendu.
 * @return array Bloc avec style.border et style.spacing.padding retirés.
 */
function dcx_nav_strip_border_data( array $parsed_block ): array {
	if ( ( $parsed_block['blockName'] ?? '' ) !== 'core/navigation' ) {
		return $parsed_block;
	}

	$border  = $parsed_block['attrs']['style']['border'] ?? [];
	$padding = $parsed_block['attrs']['style']['spacing']['padding'] ?? [];
	$shadow  = $parsed_block['attrs']['style']['shadow'] ?? '';

	$GLOBALS['dcx_nav_border_queue'][] = [
		'border'  => $border,
		'padding' => $padding,
		'shadow'  => $shadow,
	];

	if ( ! empty( $border ) ) {
		unset( $parsed_block['attrs']['style']['border'] );
	}
	if ( ! empty( $padding ) ) {
		unset( $parsed_block['attrs']['style']['spacing']['padding'] );
	}
	if ( ! empty( $shadow ) ) {
		unset( $parsed_block['attrs']['style']['shadow'] );
	}

	return $parsed_block;
}
add_filter( 'render_block_data', 'dcx_nav_strip_border_data', 5 );

/**
 * Empêche WordPress de générer du CSS inline pour les supports border et spacing/padding
 * sur core/navigation.
 *
 * @param array $settings Paramètres du type de bloc.
 * @param array $metadata Métadonnées brutes du block.json.
 * @return array Paramètres modifiés.
 */
function dcx_nav_skip_support_serialization( array $settings, array $metadata ): array {
	if ( ( $metadata['name'] ?? '' ) !== 'core/navigation' ) {
		return $settings;
	}

	if ( isset( $settings['supports']['shadow'] ) ) {
		$settings['supports']['shadow'] = false;
	}

	if ( isset( $settings['supports']['border'] ) ) {
		$settings['supports']['border']['color'] = false;
	}
	if ( isset( $settings['supports']['__experimentalBorder'] ) ) {
		$settings['supports']['__experimentalBorder']['color']                          = false;
		$settings['supports']['__experimentalBorder']['__experimentalSkipSerialization'] = true;
	}

	if ( isset( $settings['supports']['spacing'] ) ) {
		$existing = $settings['supports']['spacing']['__experimentalSkipSerialization'] ?? [];
		if ( ! in_array( 'padding', (array) $existing, true ) ) {
			$settings['supports']['spacing']['__experimentalSkipSerialization'] = array_merge(
				(array) $existing,
				[ 'padding' ]
			);
		}
	}

	return $settings;
}
add_filter( 'block_type_metadata_settings', 'dcx_nav_skip_support_serialization', 10, 2 );

/**
 * Mappe les attributs custom du bloc et les supports natifs border/padding
 * vers les CSS custom properties du thème, injectées sur le <nav> rendu.
 */
function dcx_nav_inject_item_styles( string $block_content, array $block ): string {
	if ( ( $block['blockName'] ?? '' ) !== 'core/navigation' ) {
		return $block_content;
	}

	$attrs = $block['attrs'] ?? [];

	// Attributs couleur custom (inclut navItemBorderColor → --nav-item-border-color)
	$color_map = [
		'navItemBg'               => '--nav-item-bg',
		'navItemBgHover'          => '--nav-item-bg-hover',
		'navItemBorderColor'      => '--nav-item-border-color',
		'navItemBorderColorTop'   => '--nav-item-border-color-top',
		'navItemBorderColorRight' => '--nav-item-border-color-right',
		'navItemBorderColorBottom'=> '--nav-item-border-color-bottom',
		'navItemBorderColorLeft'  => '--nav-item-border-color-left',
		'navItemColorHover'       => '--nav-item-color-hover',
		'navItemActiveBg'         => '--nav-item-active-bg',
		'navItemActiveColor'      => '--nav-item-active-color',
	];

	$css_vars = [];
	foreach ( $color_map as $attr => $var ) {
		if ( ! empty( $attrs[ $attr ] ) ) {
			$css_vars[] = esc_attr( $var ) . ': ' . esc_attr( dcx_resolve_wp_preset_var( $attrs[ $attr ] ) );
		}
	}

	// Récupère les valeurs border/padding sauvegardées par dcx_nav_strip_border_data.
	$nav_style_data = ! empty( $GLOBALS['dcx_nav_border_queue'] )
		? array_shift( $GLOBALS['dcx_nav_border_queue'] )
		: [ 'border' => [], 'padding' => [] ];

	// Support natif border (width, radius)
	$border = $nav_style_data['border'];
	if ( ! empty( $border['width'] ) ) {
		$css_vars[] = '--nav-item-border-size: ' . esc_attr( $border['width'] );
	}
	if ( ! empty( $border['radius'] ) ) {
		if ( is_array( $border['radius'] ) ) {
			$tl = esc_attr( dcx_resolve_wp_preset_var( $border['radius']['topLeft'] ?? '0' ) );
			$tr = esc_attr( dcx_resolve_wp_preset_var( $border['radius']['topRight'] ?? '0' ) );
			$br = esc_attr( dcx_resolve_wp_preset_var( $border['radius']['bottomRight'] ?? '0' ) );
			$bl = esc_attr( dcx_resolve_wp_preset_var( $border['radius']['bottomLeft'] ?? '0' ) );
			$css_vars[] = "--nav-item-radius: {$tl} {$tr} {$br} {$bl}";
		} else {
			$css_vars[] = '--nav-item-radius: ' . esc_attr( dcx_resolve_wp_preset_var( $border['radius'] ) );
		}
	}

	// Support natif shadow
	$shadow = $nav_style_data['shadow'] ?? '';
	if ( ! empty( $shadow ) ) {
		$css_vars[] = '--nav-item-shadow: ' . esc_attr( dcx_resolve_wp_preset_var( $shadow ) );
	}

	// Support natif spacing.padding
	$padding = $nav_style_data['padding'];
	if ( is_array( $padding ) ) {
		$sides = [
			'top'    => '--nav-item-padding-top',
			'right'  => '--nav-item-padding-right',
			'bottom' => '--nav-item-padding-bottom',
			'left'   => '--nav-item-padding-left',
		];
		foreach ( $sides as $side => $var ) {
			if ( ! empty( $padding[ $side ] ) ) {
				$css_vars[] = $var . ': ' . esc_attr( dcx_resolve_wp_preset_var( $padding[ $side ] ) );
			}
		}
	}

	if ( empty( $css_vars ) ) {
		return $block_content;
	}

	wp_enqueue_style( 'dcx-benchmark-luxe-nav-base' );

	$inline = implode( '; ', $css_vars );

	// Injecte dans le premier tag <nav> du rendu.
	$block_content = preg_replace_callback(
		'/(<nav\b[^>]*)(>)/i',
		static function ( array $matches ) use ( $inline ): string {
			$tag = $matches[1];

			if ( preg_match( '/\bstyle="([^"]*)"/i', $tag ) ) {
				$tag = preg_replace(
					'/\bstyle="([^"]*)"/i',
					'style="$1; ' . $inline . '"',
					$tag
				);
			} else {
				$tag .= ' style="' . $inline . '"';
			}

			return $tag . $matches[2];
		},
		$block_content,
		1 // Premier <nav> uniquement.
	);

	// Injecte aussi sur le <ul class="wp-block-navigation__container"> car Gutenberg
	// y duplique les classes du <nav> (dont is-style-nav-internal), ce qui déclenche
	// la règle CSS du thème et réinitialise les variables. L'inline style sur le <ul>
	// prend le dessus (spécificité 1,0,0,0 > 0,2,0) et rétablit les bonnes valeurs.
	$block_content = preg_replace_callback(
		'/(<ul\b[^>]*\bwp-block-navigation__container\b[^>]*)(>)/i',
		static function ( array $matches ) use ( $inline ): string {
			$tag = $matches[1];

			if ( preg_match( '/\bstyle="([^"]*)"/i', $tag ) ) {
				$tag = preg_replace(
					'/\bstyle="([^"]*)"/i',
					'style="$1; ' . $inline . '"',
					$tag
				);
			} else {
				$tag .= ' style="' . $inline . '"';
			}

			return $tag . $matches[2];
		},
		$block_content,
		1 // Premier <ul> uniquement.
	);

	return $block_content;
}
add_filter( 'render_block', 'dcx_nav_inject_item_styles', 10, 2 );
