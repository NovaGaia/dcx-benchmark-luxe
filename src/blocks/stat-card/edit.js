import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import {
	useBlockProps,
	InspectorControls,
	PanelColorSettings,
	FontSizePicker,
	ColorPalette,
	RichText,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	RangeControl,
} from '@wordpress/components';

/**
 * Si le hex correspond à une couleur du thème, retourne la CSS var WordPress.
 * Sinon retourne la valeur telle quelle (couleur custom).
 * @param hex
 * @param colors
 */
function hexToVar( hex, colors ) {
	if ( ! hex || ! colors ) {
		return hex;
	}
	const match = colors.find(
		( c ) => c.color?.toLowerCase() === hex.toLowerCase()
	);
	return match ? `var(--wp--preset--color--${ match.slug })` : hex;
}

/**
 * Si la valeur est une var() WordPress, résout vers le hex pour l'affichage
 * dans le color picker (sélection du bon swatch).
 * @param value
 * @param colors
 */
function resolveToHex( value, colors ) {
	if ( ! value || ! colors ) {
		return value;
	}
	const varMatch = value.match( /var\(--wp--preset--color--([^)]+)\)/ );
	if ( varMatch ) {
		return colors.find( ( c ) => c.slug === varMatch[ 1 ] )?.color ?? value;
	}
	return value;
}

export default function Edit( { attributes, setAttributes } ) {
	const {
		number,
		suffix,
		suffixPosition,
		label,
		accentColor,
		accentBorderWidth,
		numberColor,
		numberFontSize,
		labelColor,
		labelFontSize,
	} = attributes;

	const { colors } = useSelect( ( select ) => ( {
		colors: select( blockEditorStore ).getSettings().colors,
	} ) );

	const blockProps = useBlockProps( {
		className: 'dcx-stat-card',
		style: {
			'--dcx-stat-accent': accentColor || 'transparent',
			'--dcx-stat-accent-width': `${ accentBorderWidth }px`,
		},
	} );

	const SuffixTag = suffixPosition === 'sub' ? 'sub' : 'sup';

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Contenu', 'dcx-benchmark-luxe' ) }
					initialOpen={ true }
				>
					<TextControl
						label={ __(
							'Suffixe (optionnel)',
							'dcx-benchmark-luxe'
						) }
						value={ suffix }
						onChange={ ( value ) =>
							setAttributes( { suffix: value } )
						}
						placeholder="rd"
					/>
					<ToggleControl
						label={ __( 'Exposant (sup)', 'dcx-benchmark-luxe' ) }
						help={
							suffixPosition === 'sup'
								? __(
										'Suffixe en exposant',
										'dcx-benchmark-luxe'
								  )
								: __(
										'Suffixe en indice',
										'dcx-benchmark-luxe'
								  )
						}
						checked={ suffixPosition === 'sup' }
						onChange={ ( value ) =>
							setAttributes( {
								suffixPosition: value ? 'sup' : 'sub',
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorControls>
				<PanelBody
					title={ __( 'Chiffre & suffixe', 'dcx-benchmark-luxe' ) }
					initialOpen
				>
					<FontSizePicker
						value={ numberFontSize }
						onChange={ ( value ) =>
							setAttributes( { numberFontSize: value ?? '' } )
						}
						withReset
					/>
					<div style={ { marginTop: '16px' } } />
					<ColorPalette
						value={ resolveToHex( numberColor, colors ) }
						onChange={ ( value ) =>
							setAttributes( {
								numberColor: value
									? hexToVar( value, colors )
									: '',
							} )
						}
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Libellé', 'dcx-benchmark-luxe' ) }
					initialOpen={ false }
				>
					<FontSizePicker
						value={ labelFontSize }
						onChange={ ( value ) =>
							setAttributes( { labelFontSize: value ?? '' } )
						}
						withReset
					/>
					<div style={ { marginTop: '16px' } } />
					<ColorPalette
						value={ resolveToHex( labelColor, colors ) }
						onChange={ ( value ) =>
							setAttributes( {
								labelColor: value
									? hexToVar( value, colors )
									: '',
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorControls group="styles">
				<PanelColorSettings
					title={ __( "Couleur d'accent", 'dcx-benchmark-luxe' ) }
					colorSettings={ [
						{
							value: resolveToHex( accentColor, colors ),
							onChange: ( value ) =>
								setAttributes( {
									accentColor: value
										? hexToVar( value, colors )
										: '',
								} ),
							label: __(
								'Ligne supérieure',
								'dcx-benchmark-luxe'
							),
						},
					] }
				>
					<RangeControl
						label={ __( 'Épaisseur (px)', 'dcx-benchmark-luxe' ) }
						value={ accentBorderWidth }
						onChange={ ( value ) =>
							setAttributes( { accentBorderWidth: value } )
						}
						min={ 1 }
						max={ 20 }
					/>
				</PanelColorSettings>
			</InspectorControls>

			<div { ...blockProps }>
				<div
					className="dcx-stat-card__number"
					style={ {
						color: numberColor || undefined,
						fontSize: numberFontSize || undefined,
					} }
				>
					<RichText
						tagName="span"
						allowedFormats={ [] }
						value={ number }
						onChange={ ( value ) =>
							setAttributes( { number: value } )
						}
						placeholder="3"
					/>
					{ suffix && (
						<SuffixTag className="dcx-stat-card__suffix">
							{ suffix }
						</SuffixTag>
					) }
				</div>
				<RichText
					tagName="p"
					className="dcx-stat-card__label"
					allowedFormats={ [] }
					value={ label }
					onChange={ ( value ) => setAttributes( { label: value } ) }
					placeholder="LARGEST E-COMMERCE MARKET (EUROPE)"
					style={ {
						color: labelColor || undefined,
						fontSize: labelFontSize || undefined,
					} }
				/>
			</div>
		</>
	);
}
