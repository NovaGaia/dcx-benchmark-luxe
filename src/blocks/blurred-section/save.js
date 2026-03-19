import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
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
	} = attributes;

	const blockProps = useBlockProps.save( {
		className: 'dcx-blurred-section',
		style: {
			minHeight,
			maxHeight: maxHeight || undefined,
		},
	} );

	const blurMask = `linear-gradient(to bottom, transparent 0%, black calc(100% - ${ overlayHeight }%))`;

	return (
		<div { ...blockProps }>
			{ /* Contenu — pas de blur ici, pointer-events désactivés */ }
			<div
				className="dcx-blurred-section__content"
				style={ { pointerEvents: 'none', userSelect: 'none' } }
			>
				<InnerBlocks.Content />
			</div>

			{ /* Flou progressif : 0 en haut → blur max à la position overlayHeight */ }
			<div
				className="dcx-blurred-section__blur-overlay"
				style={ {
					backdropFilter: `blur(${ blurIntensity }px)`,
					WebkitBackdropFilter: `blur(${ blurIntensity }px)`,
					maskImage: blurMask,
					WebkitMaskImage: blurMask,
				} }
			/>

			{ /* Fond opaque + CTA */ }
			<div
				className="dcx-blurred-section__overlay"
				style={ {
					background: `linear-gradient(to top, ${ gradientColor } ${ overlayHeight }%, transparent)`,
				} }
			>
				<div className="dcx-blurred-section__cta">
					<RichText.Content
						tagName="p"
						className="dcx-blurred-section__cta-title"
						value={ overlayTitle }
					/>
					<RichText.Content
						tagName="p"
						className="dcx-blurred-section__cta-description"
						value={ overlayDescription }
					/>
					<div className="wp-block-buttons is-content-justification-center is-layout-flex">
						<div className="wp-block-button">
							<button
								type="button"
								className="wp-block-button__link wp-element-button dcx-blurred-section__open-btn"
							>
								<span className="dcx-blurred-section__btn-icon">
									{ buttonIcon }
								</span>
								<RichText.Content
									tagName="span"
									className="dcx-blurred-section__btn-text"
									value={ buttonText }
								/>
							</button>
						</div>
					</div>
				</div>
			</div>

			{ /* Modal HubSpot */ }
			<div
				className="dcx-blurred-section__modal"
				hidden
				aria-modal="true"
				role="dialog"
				aria-label={ overlayTitle }
			>
				<div
					className="dcx-blurred-section__modal-overlay"
					aria-hidden="true"
				/>
				<div className="dcx-blurred-section__modal-inner">
					<button
						type="button"
						className="dcx-blurred-section__modal-close"
						aria-label="Fermer"
					>
						×
					</button>
					{ iframeUrl && (
						<iframe
							src={ iframeUrl }
							title="Formulaire HubSpot"
							width="100%"
							height="500"
						/>
					) }
				</div>
			</div>
		</div>
	);
}
