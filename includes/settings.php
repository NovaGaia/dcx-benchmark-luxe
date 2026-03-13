<?php
/**
 * Page de réglages admin du plugin DCX Benchmark Luxe (couleurs des charts).
 *
 * @package DCX_Benchmark_Luxe
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Couleurs par défaut.
 */
function dcx_bar_chart_default_colors() {
	return [ '#1a2b4a', '#4cb8c4', '#5c6bc0', '#e57373', '#9e9e9e' ];
}

/**
 * Enregistre les réglages et ajoute la page admin.
 */
function dcx_bar_chart_settings_init() {
	register_setting(
		'dcx_bar_chart',
		'dcx_benchmark_luxe_bar_colors',
		[
			'type'              => 'array',
			'sanitize_callback' => 'dcx_bar_chart_sanitize_colors',
			'default'           => dcx_bar_chart_default_colors(),
		]
	);
}
add_action( 'admin_init', 'dcx_bar_chart_settings_init' );

/**
 * Sanitize le tableau de couleurs.
 *
 * @param mixed $value Valeur soumise.
 * @return array
 */
function dcx_bar_chart_sanitize_colors( $value ) {
	if ( ! is_array( $value ) ) {
		return dcx_bar_chart_default_colors();
	}
	$colors = array_map( 'sanitize_hex_color', $value );
	$colors = array_values( array_filter( $colors ) );
	return empty( $colors ) ? dcx_bar_chart_default_colors() : $colors;
}

/**
 * Ajoute la page sous Réglages.
 */
function dcx_bar_chart_add_options_page() {
	add_options_page(
		__( 'DCX Benchmark Luxe — Configuration', 'dcx-benchmark-luxe' ),
		__( 'DCX Benchmark Luxe', 'dcx-benchmark-luxe' ),
		'manage_options',
		'dcx-bar-chart-colors',
		'dcx_bar_chart_settings_page'
	);
}
add_action( 'admin_menu', 'dcx_bar_chart_add_options_page' );

/**
 * Rendu de la page de réglages.
 */
function dcx_bar_chart_settings_page() {
	$colors = get_option( 'dcx_benchmark_luxe_bar_colors', dcx_bar_chart_default_colors() );
	if ( ! is_array( $colors ) || empty( $colors ) ) {
		$colors = dcx_bar_chart_default_colors();
	}
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'DCX Benchmark Luxe — Configuration', 'dcx-benchmark-luxe' ); ?></h1>
		<h2><?php esc_html_e( 'Couleurs des charts', 'dcx-benchmark-luxe' ); ?></h2>
		<p><?php esc_html_e( 'Définissez les couleurs appliquées aux barres/parts du graphique, dans l\'ordre des entrées de données.', 'dcx-benchmark-luxe' ); ?></p>
		<form method="post" action="options.php">
			<?php settings_fields( 'dcx_bar_chart' ); ?>
			<div id="dcx-color-list">
				<?php foreach ( $colors as $index => $color ) : ?>
				<div class="dcx-color-row" style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
					<input type="color" name="dcx_benchmark_luxe_bar_colors[]" value="<?php echo esc_attr( $color ); ?>" style="width:48px;height:36px;cursor:pointer;">
					<input type="text" name="dcx_benchmark_luxe_bar_colors[]" value="<?php echo esc_attr( $color ); ?>" style="display:none;">
					<button type="button" class="button dcx-remove-color" aria-label="<?php esc_attr_e( 'Supprimer cette couleur', 'dcx-benchmark-luxe' ); ?>">×</button>
				</div>
				<?php endforeach; ?>
			</div>
			<p>
				<button type="button" id="dcx-add-color" class="button">
					<?php esc_html_e( '+ Ajouter une couleur', 'dcx-benchmark-luxe' ); ?>
				</button>
			</p>
			<?php submit_button(); ?>
		</form>
	</div>
	<script>
	(function() {
		var list = document.getElementById('dcx-color-list');

		function syncText(row) {
			var colorInput = row.querySelector('input[type="color"]');
			var textInput  = row.querySelector('input[type="text"]');
			colorInput.addEventListener('input', function() {
				textInput.value = colorInput.value;
			});
		}

		// Sync existing rows
		list.querySelectorAll('.dcx-color-row').forEach(function(row) {
			syncText(row);
			row.querySelector('.dcx-remove-color').addEventListener('click', function() {
				row.remove();
			});
		});

		// Add new color
		document.getElementById('dcx-add-color').addEventListener('click', function() {
			var row = document.createElement('div');
			row.className = 'dcx-color-row';
			row.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:8px;';
			row.innerHTML =
				'<input type="color" name="dcx_benchmark_luxe_bar_colors[]" value="#000000" style="width:48px;height:36px;cursor:pointer;">' +
				'<input type="text" name="dcx_benchmark_luxe_bar_colors[]" value="#000000" style="display:none;">' +
				'<button type="button" class="button dcx-remove-color" aria-label="<?php echo esc_js( __( 'Supprimer cette couleur', 'dcx-benchmark-luxe' ) ); ?>">×</button>';
			list.appendChild(row);
			syncText(row);
			row.querySelector('.dcx-remove-color').addEventListener('click', function() {
				row.remove();
			});
		});

		// Before submit: sync all color inputs from color picker to hidden text fields
		document.querySelector('form').addEventListener('submit', function() {
			list.querySelectorAll('.dcx-color-row').forEach(function(row) {
				var colorInput = row.querySelector('input[type="color"]');
				var textInput  = row.querySelector('input[type="text"]');
				textInput.value = colorInput.value;
				// Rename text input to submit, disable color input
				textInput.name = 'dcx_benchmark_luxe_bar_colors[]';
				textInput.style.display = 'inline';
				colorInput.removeAttribute('name');
			});
		});
	})();
	</script>
	<?php
}

/**
 * Passe les couleurs à l'éditeur Gutenberg via wp_localize_script.
 */
function dcx_bar_chart_localize_colors() {
	$colors = get_option( 'dcx_benchmark_luxe_bar_colors', dcx_bar_chart_default_colors() );
	if ( ! is_array( $colors ) || empty( $colors ) ) {
		$colors = dcx_bar_chart_default_colors();
	}

	$handle = 'dcx-benchmark-luxe-horizontal-bar-chart-editor-script';
	if ( wp_script_is( $handle, 'registered' ) ) {
		wp_localize_script(
			$handle,
			'dcxBarChartSettings',
			[ 'barColors' => array_values( $colors ) ]
		);
	}
}
add_action( 'enqueue_block_editor_assets', 'dcx_bar_chart_localize_colors' );
