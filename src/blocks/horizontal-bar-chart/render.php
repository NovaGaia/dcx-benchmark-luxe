<?php
/**
 * Rendu serveur du bloc horizontal-bar-chart.
 *
 * @package DCX_Benchmark_Luxe
 *
 * @var array    $attributes Attributs du bloc.
 * @var string   $content    Contenu interne (non utilisé — bloc dynamique).
 * @var WP_Block $block      Instance du bloc.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$default_colors = [ '#1a2b4a', '#4cb8c4', '#5c6bc0', '#e57373', '#9e9e9e' ];
$colors         = get_option( 'dcx_benchmark_luxe_bar_colors', $default_colors );
if ( ! is_array( $colors ) || empty( $colors ) ) {
	$colors = $default_colors;
}
$colors = array_values( $colors );

$title          = isset( $attributes['title'] ) ? $attributes['title'] : '';
$title_font     = isset( $attributes['titleFontSize'] ) ? $attributes['titleFontSize'] : '';
$items          = isset( $attributes['items'] ) && is_array( $attributes['items'] ) ? $attributes['items'] : [];
$chart_type     = isset( $attributes['chartType'] ) && 'pie' === $attributes['chartType'] ? 'pie' : 'bar';
$insight_text   = isset( $attributes['insightText'] ) ? $attributes['insightText'] : '';
$modal_title    = isset( $attributes['modalTitle'] ) ? $attributes['modalTitle'] : '';
$modal_body     = isset( $attributes['modalBody'] ) ? $attributes['modalBody'] : '';
$value_suffix   = isset( $attributes['valueSuffix'] ) ? $attributes['valueSuffix'] : '%';
$x_max          = isset( $attributes['xMax'] ) ? intval( $attributes['xMax'] ) : 100;
$use_theme_btn  = ! empty( $attributes['useThemeButton'] );
$btn_class      = 'dcx-bar-chart__insight-btn' . ( $use_theme_btn ? ' wp-element-button wp-block-button__link' : '' );

$labels = [];
$values = [];
$item_colors = [];
foreach ( $items as $index => $item ) {
	$labels[]      = isset( $item['label'] ) ? $item['label'] : '';
	$values[]      = isset( $item['value'] ) ? floatval( $item['value'] ) : 0;
	$item_colors[] = $colors[ $index % count( $colors ) ];
}

$chart_data = wp_json_encode(
	[
		'type'        => $chart_type,
		'labels'      => $labels,
		'values'      => $values,
		'colors'      => $item_colors,
		'valueSuffix' => $value_suffix,
		'xMax'        => $x_max,
	]
);

$modal_id = wp_unique_id( 'dcx-bar-chart-modal-' );

$wrapper_attributes = get_block_wrapper_attributes( [ 'class' => 'dcx-bar-chart' ] );
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

	<?php if ( $title ) : ?>
	<p class="dcx-bar-chart__title"<?php echo $title_font ? ' style="font-size:' . esc_attr( $title_font ) . '"' : ''; ?>>
		<?php echo wp_kses_post( $title ); ?>
	</p>
	<?php endif; ?>

	<div class="dcx-bar-chart__chart-wrap">
		<canvas
			class="dcx-bar-chart__canvas"
			data-chart="<?php echo esc_attr( $chart_data ); ?>"
			aria-label="<?php echo esc_attr( $title ); ?>"
			role="img"
		></canvas>
	</div>

	<?php if ( ! empty( $labels ) ) : ?>
	<ul class="dcx-bar-chart__legend" aria-hidden="true">
		<?php foreach ( $labels as $index => $label ) : ?>
		<li class="dcx-bar-chart__legend-item">
			<span
				class="dcx-bar-chart__legend-dot"
				style="background-color:<?php echo esc_attr( $item_colors[ $index ] ); ?>;"
			></span>
			<?php echo esc_html( $label ); ?> (<?php echo esc_html( $values[ $index ] ) . esc_html( $value_suffix ); ?>)
		</li>
		<?php endforeach; ?>
	</ul>
	<?php endif; ?>

	<?php if ( $insight_text ) : ?>
	<div class="dcx-bar-chart__insight">
		<button
			type="button"
			class="<?php echo esc_attr( $btn_class ); ?>"
			aria-controls="<?php echo esc_attr( $modal_id ); ?>"
			aria-expanded="false"
		>
			<?php echo wp_kses_post( $insight_text ); ?>
		</button>
	</div>
	<?php endif; ?>

	<?php if ( $insight_text ) : ?>
	<div
		id="<?php echo esc_attr( $modal_id ); ?>"
		class="dcx-bar-chart__modal"
		role="dialog"
		aria-modal="true"
		aria-labelledby="<?php echo esc_attr( $modal_id ); ?>-title"
		hidden
	>
		<div class="dcx-bar-chart__modal-overlay" aria-hidden="true"></div>
		<div class="dcx-bar-chart__modal-inner">
			<button
				type="button"
				class="dcx-bar-chart__modal-close"
				aria-label="<?php esc_attr_e( 'Fermer la modale', 'dcx-benchmark-luxe' ); ?>"
			>×</button>
			<?php if ( $modal_title ) : ?>
			<p id="<?php echo esc_attr( $modal_id ); ?>-title" class="dcx-bar-chart__modal-title">
				<?php echo esc_html( $modal_title ); ?>
			</p>
			<?php endif; ?>
			<?php if ( $modal_body ) : ?>
			<div class="dcx-bar-chart__modal-body">
				<?php echo wp_kses_post( $modal_body ); ?>
			</div>
			<?php endif; ?>
		</div>
	</div>
	<?php endif; ?>

</div>
