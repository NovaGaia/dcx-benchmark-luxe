import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const {
		title,
		description,
		buttonText,
		buttonUrl,
		buttonIcon,
		linkTarget,
		titleColor,
		titleFontSize,
		descriptionColor,
		descriptionFontSize,
	} = attributes;

	const titleStyle =
		titleColor || titleFontSize
			? {
					color: titleColor || undefined,
					fontSize: titleFontSize || undefined,
			  }
			: undefined;

	const descriptionStyle =
		descriptionColor || descriptionFontSize
			? {
					color: descriptionColor || undefined,
					fontSize: descriptionFontSize || undefined,
			  }
			: undefined;

	const linkProps = linkTarget
		? { target: '_blank', rel: 'noreferrer noopener' }
		: {};

	const rawGap = attributes.style?.spacing?.blockGap;
	const gapValue = rawGap
		? rawGap.replace(
				/^var:([^|]+)\|([^|]+)\|(.+)$/,
				'var(--wp--$1--$2--$3)'
		  )
		: undefined;

	return (
		<div
			{ ...useBlockProps.save( {
				className: 'dcx-cta',
				style: gapValue
					? { '--wp--style--block-gap': gapValue }
					: undefined,
			} ) }
		>
			<RichText.Content
				tagName="p"
				className="dcx-cta__title"
				value={ title }
				{ ...( titleStyle ? { style: titleStyle } : {} ) }
			/>
			<RichText.Content
				tagName="p"
				className="dcx-cta__description"
				value={ description }
				{ ...( descriptionStyle ? { style: descriptionStyle } : {} ) }
			/>
			<div className="wp-block-buttons is-content-justification-center is-layout-flex">
				<div className="wp-block-button">
					<a
						href={ buttonUrl }
						className="wp-block-button__link wp-element-button"
						{ ...linkProps }
					>
						<span className="dcx-cta__button-icon">
							{ buttonIcon }
						</span>
						<RichText.Content
							tagName="span"
							className="dcx-cta__button-text"
							value={ buttonText }
						/>
					</a>
				</div>
			</div>
		</div>
	);
}
