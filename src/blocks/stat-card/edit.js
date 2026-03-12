import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	PanelColorSettings,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { number, suffix, suffixPosition, label, accentColor } = attributes;

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
							'Chiffre principal',
							'dcx-benchmark-luxe'
						) }
						value={ number }
						onChange={ ( value ) =>
							setAttributes( { number: value } )
						}
						placeholder="3"
					/>
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
					<TextControl
						label={ __( 'Libellé', 'dcx-benchmark-luxe' ) }
						value={ label }
						onChange={ ( value ) =>
							setAttributes( { label: value } )
						}
						placeholder="LARGEST E-COMMERCE MARKET (EUROPE)"
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
				<p className="dcx-stat-card__number">
					{ number }
					{ suffix && (
						<SuffixTag className="dcx-stat-card__suffix">
							{ suffix }
						</SuffixTag>
					) }
				</p>
				{ label && <p className="dcx-stat-card__label">{ label }</p> }
			</div>
		</>
	);
}
