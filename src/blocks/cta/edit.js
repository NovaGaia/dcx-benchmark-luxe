import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import {
	useBlockProps,
	InspectorControls,
	RichText,
	ColorPalette,
	FontSizePicker,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';

function hexToVar( hex, colors ) {
	if ( ! hex || ! colors ) {
		return hex;
	}
	const match = colors.find(
		( c ) => c.color?.toLowerCase() === hex.toLowerCase()
	);
	return match ? `var(--wp--preset--color--${ match.slug })` : hex;
}

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
		title,
		description,
		buttonText,
		buttonUrl,
		buttonIcon,
		linkTarget,
		useThemeButton,
		titleColor,
		titleFontSize,
		descriptionColor,
		descriptionFontSize,
	} = attributes;

	const { colors } = useSelect( ( select ) => ( {
		colors: select( blockEditorStore ).getSettings().colors,
	} ) );

	const rawGap = attributes.style?.spacing?.blockGap;
	const gapValue = rawGap
		? rawGap.replace(
				/^var:([^|]+)\|([^|]+)\|(.+)$/,
				'var(--wp--$1--$2--$3)'
		  )
		: undefined;
	const blockProps = useBlockProps( {
		className: 'dcx-cta',
		style: gapValue ? { '--wp--style--block-gap': gapValue } : undefined,
	} );

	const btnClass =
		'dcx-cta__button' +
		( useThemeButton ? ' wp-element-button wp-block-button__link' : '' );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Titre', 'dcx-benchmark-luxe' ) }
					initialOpen={ false }
				>
					<FontSizePicker
						value={ titleFontSize }
						onChange={ ( value ) =>
							setAttributes( { titleFontSize: value ?? '' } )
						}
						withReset
					/>
					<div style={ { marginTop: '16px' } } />
					<ColorPalette
						value={ resolveToHex( titleColor, colors ) }
						onChange={ ( value ) =>
							setAttributes( {
								titleColor: value
									? hexToVar( value, colors )
									: '',
							} )
						}
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Description', 'dcx-benchmark-luxe' ) }
					initialOpen={ false }
				>
					<FontSizePicker
						value={ descriptionFontSize }
						onChange={ ( value ) =>
							setAttributes( {
								descriptionFontSize: value ?? '',
							} )
						}
						withReset
					/>
					<div style={ { marginTop: '16px' } } />
					<ColorPalette
						value={ resolveToHex( descriptionColor, colors ) }
						onChange={ ( value ) =>
							setAttributes( {
								descriptionColor: value
									? hexToVar( value, colors )
									: '',
							} )
						}
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Bouton', 'dcx-benchmark-luxe' ) }
					initialOpen={ true }
				>
					<TextControl
						label={ __( 'URL du bouton', 'dcx-benchmark-luxe' ) }
						value={ buttonUrl }
						onChange={ ( value ) =>
							setAttributes( { buttonUrl: value } )
						}
						placeholder="https://"
					/>
					<ToggleControl
						label={ __(
							'Ouvrir dans un nouvel onglet',
							'dcx-benchmark-luxe'
						) }
						checked={ linkTarget }
						onChange={ ( value ) =>
							setAttributes( { linkTarget: value } )
						}
					/>
					<ToggleControl
						label={ __(
							'Style bouton du thème',
							'dcx-benchmark-luxe'
						) }
						help={ __(
							'Utilise les styles de bouton définis dans le thème.',
							'dcx-benchmark-luxe'
						) }
						checked={ useThemeButton }
						onChange={ ( value ) =>
							setAttributes( { useThemeButton: value } )
						}
					/>
					<TextControl
						label={ __( 'Icône / Emoji', 'dcx-benchmark-luxe' ) }
						value={ buttonIcon }
						onChange={ ( value ) =>
							setAttributes( { buttonIcon: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<RichText
					tagName="p"
					className="dcx-cta__title"
					allowedFormats={ [ 'core/bold', 'core/italic' ] }
					value={ title }
					onChange={ ( value ) => setAttributes( { title: value } ) }
					placeholder={ __(
						'Vous souhaitez aller plus loin ?',
						'dcx-benchmark-luxe'
					) }
					style={ {
						color: titleColor || undefined,
						fontSize: titleFontSize || undefined,
					} }
				/>
				<RichText
					tagName="p"
					className="dcx-cta__description"
					allowedFormats={ [ 'core/bold', 'core/italic' ] }
					value={ description }
					onChange={ ( value ) =>
						setAttributes( { description: value } )
					}
					placeholder={ __(
						'Recevez la fiche complète…',
						'dcx-benchmark-luxe'
					) }
					style={ {
						color: descriptionColor || undefined,
						fontSize: descriptionFontSize || undefined,
					} }
				/>
				{ /* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
				<a
					className={ btnClass }
					href={ buttonUrl || '#' }
					style={ { pointerEvents: 'none' } }
					tabIndex={ -1 }
				>
					<span className="dcx-cta__button-icon">{ buttonIcon }</span>
					<RichText
						tagName="span"
						className="dcx-cta__button-text"
						allowedFormats={ [] }
						value={ buttonText }
						onChange={ ( value ) =>
							setAttributes( { buttonText: value } )
						}
						placeholder={ __(
							'En savoir plus',
							'dcx-benchmark-luxe'
						) }
					/>
				</a>
			</div>
		</>
	);
}
