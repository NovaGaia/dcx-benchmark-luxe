import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	PanelColorSettings,
	FontSizePicker,
	ColorPalette,
	RichText,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const {
		number,
		suffix,
		suffixPosition,
		label,
		accentColor,
		numberColor,
		numberFontSize,
		labelColor,
		labelFontSize,
	} = attributes;

	const blockProps = useBlockProps( {
		className: `dcx-stat-card${ accentColor ? ' has-accent' : '' }`,
		style: {
			'--dcx-stat-accent': accentColor || 'transparent',
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
						value={ numberColor }
						onChange={ ( value ) =>
							setAttributes( { numberColor: value ?? '' } )
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
						value={ labelColor }
						onChange={ ( value ) =>
							setAttributes( { labelColor: value ?? '' } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorControls group="styles">
				<PanelColorSettings
					title={ __( "Couleur d'accent", 'dcx-benchmark-luxe' ) }
					colorSettings={ [
						{
							value: accentColor,
							onChange: ( value ) =>
								setAttributes( { accentColor: value || '' } ),
							label: __(
								'Ligne supérieure',
								'dcx-benchmark-luxe'
							),
						},
					] }
				/>
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
