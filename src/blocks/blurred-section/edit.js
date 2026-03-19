import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
	RichText,
	ColorPalette,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const {
		overlayTitle,
		overlayDescription,
		buttonText,
		buttonIcon,
		iframeUrl,
		overlayHeight,
		gradientColor,
		blurIntensity,
		minHeight,
		maxHeight,
		showBlurPreview,
	} = attributes;

	const { colors } = useSelect( ( select ) => ( {
		colors: select( blockEditorStore ).getSettings().colors,
	} ) );

	const blockProps = useBlockProps( {
		className: 'dcx-blurred-section',
		style: showBlurPreview
			? { minHeight, maxHeight: maxHeight || undefined }
			: {},
	} );

	const blurMask = `linear-gradient(to bottom, transparent 0%, black calc(100% - ${ overlayHeight }%))`;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Flou & Overlay', 'dcx-benchmark-luxe' ) }
					initialOpen={ true }
				>
					<ToggleControl
						label={ __(
							"Prévisualiser le flou dans l'éditeur",
							'dcx-benchmark-luxe'
						) }
						help={
							showBlurPreview
								? __(
										'Le contenu est masqué — désactiver pour éditer.',
										'dcx-benchmark-luxe'
								  )
								: __(
										'Activer pour voir le rendu final.',
										'dcx-benchmark-luxe'
								  )
						}
						checked={ showBlurPreview }
						onChange={ ( value ) =>
							setAttributes( { showBlurPreview: value } )
						}
					/>
					<RangeControl
						label={ __(
							"Hauteur de l'overlay (%)",
							'dcx-benchmark-luxe'
						) }
						value={ overlayHeight }
						onChange={ ( value ) =>
							setAttributes( { overlayHeight: value } )
						}
						min={ 20 }
						max={ 80 }
					/>
					<RangeControl
						label={ __(
							'Intensité du flou (px)',
							'dcx-benchmark-luxe'
						) }
						value={ blurIntensity }
						onChange={ ( value ) =>
							setAttributes( { blurIntensity: value } )
						}
						min={ 2 }
						max={ 12 }
					/>
					<TextControl
						label={ __(
							'Hauteur minimale du bloc',
							'dcx-benchmark-luxe'
						) }
						value={ minHeight }
						onChange={ ( value ) =>
							setAttributes( { minHeight: value } )
						}
						help={ __( 'Ex : 300px, 20rem', 'dcx-benchmark-luxe' ) }
					/>
					<TextControl
						label={ __(
							'Hauteur maximale du bloc',
							'dcx-benchmark-luxe'
						) }
						value={ maxHeight }
						onChange={ ( value ) =>
							setAttributes( { maxHeight: value } )
						}
						help={ __(
							'Coupe le contenu qui dépasse. Ex : 500px',
							'dcx-benchmark-luxe'
						) }
					/>
					<p style={ { marginBottom: '8px', fontWeight: 600 } }>
						{ __( 'Couleur du fondu', 'dcx-benchmark-luxe' ) }
					</p>
					<ColorPalette
						colors={ colors }
						value={ gradientColor }
						onChange={ ( value ) =>
							setAttributes( {
								gradientColor: value ?? '#ffffff',
							} )
						}
						disableCustomColors={ false }
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Bouton CTA', 'dcx-benchmark-luxe' ) }
					initialOpen={ false }
				>
					<TextControl
						label={ __( 'Icône / Emoji', 'dcx-benchmark-luxe' ) }
						value={ buttonIcon }
						onChange={ ( value ) =>
							setAttributes( { buttonIcon: value } )
						}
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'HubSpot', 'dcx-benchmark-luxe' ) }
					initialOpen={ false }
				>
					<TextControl
						label={ __(
							'URL du formulaire',
							'dcx-benchmark-luxe'
						) }
						value={ iframeUrl }
						onChange={ ( value ) =>
							setAttributes( { iframeUrl: value } )
						}
						placeholder="https://share.hsforms.com/…"
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ ! showBlurPreview && (
					<div className="dcx-blurred-section__editor-notice">
						{ __(
							'⚠ Ce contenu sera flouté en front-end',
							'dcx-benchmark-luxe'
						) }
					</div>
				) }

				{ /* Contenu innerBlocks */ }
				<div
					className="dcx-blurred-section__content"
					style={
						showBlurPreview
							? { pointerEvents: 'none', userSelect: 'none' }
							: {}
					}
				>
					<InnerBlocks />
				</div>

				{ /* Flou progressif — visible uniquement en mode prévisualisation */ }
				{ showBlurPreview && (
					<div
						className="dcx-blurred-section__blur-overlay"
						style={ {
							backdropFilter: `blur(${ blurIntensity }px)`,
							WebkitBackdropFilter: `blur(${ blurIntensity }px)`,
							maskImage: blurMask,
							WebkitMaskImage: blurMask,
						} }
					/>
				) }

				{ /* Overlay CTA — toujours éditable, positionné différemment selon le mode */ }
				<div
					className={
						showBlurPreview
							? 'dcx-blurred-section__overlay'
							: 'dcx-blurred-section__overlay dcx-blurred-section__overlay--editor'
					}
					style={ {
						background: `linear-gradient(to top, ${ gradientColor } ${ overlayHeight }%, transparent)`,
					} }
				>
					<div className="dcx-blurred-section__cta">
						<RichText
							tagName="p"
							className="dcx-blurred-section__cta-title"
							value={ overlayTitle }
							onChange={ ( value ) =>
								setAttributes( { overlayTitle: value } )
							}
							placeholder={ __(
								"Envie d'en savoir plus ?",
								'dcx-benchmark-luxe'
							) }
							allowedFormats={ [ 'core/bold', 'core/italic' ] }
						/>
						<RichText
							tagName="p"
							className="dcx-blurred-section__cta-description"
							value={ overlayDescription }
							onChange={ ( value ) =>
								setAttributes( { overlayDescription: value } )
							}
							placeholder={ __(
								'Accédez au contenu complet…',
								'dcx-benchmark-luxe'
							) }
							allowedFormats={ [ 'core/bold', 'core/italic' ] }
						/>
						<div className="wp-block-buttons is-content-justification-center is-layout-flex">
							<div className="wp-block-button">
								{ /* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
								<a
									className="wp-block-button__link wp-element-button"
									style={ { pointerEvents: 'none' } }
									tabIndex={ -1 }
								>
									<span className="dcx-blurred-section__btn-icon">
										{ buttonIcon }
									</span>
									<RichText
										tagName="span"
										className="dcx-blurred-section__btn-text"
										value={ buttonText }
										onChange={ ( value ) =>
											setAttributes( {
												buttonText: value,
											} )
										}
										placeholder={ __(
											'Accéder au contenu',
											'dcx-benchmark-luxe'
										) }
										allowedFormats={ [] }
									/>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
