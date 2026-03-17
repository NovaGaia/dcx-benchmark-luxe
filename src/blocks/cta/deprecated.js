import { useBlockProps, RichText } from '@wordpress/block-editor';

// v2 — bouton direct <a class="dcx-cta__button wp-element-button wp-block-button__link">
const v2 = {
	attributes: {
		title: { type: 'string', default: 'Vous souhaitez aller plus loin ?' },
		description: { type: 'string', default: 'Recevez la fiche complète…' },
		buttonText: { type: 'string', default: 'En savoir plus' },
		buttonUrl: { type: 'string', default: '' },
		buttonIcon: { type: 'string', default: '✉️' },
		linkTarget: { type: 'boolean', default: false },
		titleColor: { type: 'string', default: '' },
		titleFontSize: { type: 'string', default: '' },
		descriptionColor: { type: 'string', default: '' },
		descriptionFontSize: { type: 'string', default: '' },
	},
	save( { attributes } ) {
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
					{ ...( descriptionStyle
						? { style: descriptionStyle }
						: {} ) }
				/>
				<a
					href={ buttonUrl }
					className="dcx-cta__button wp-element-button wp-block-button__link"
					{ ...linkProps }
				>
					<span className="dcx-cta__button-icon">{ buttonIcon }</span>
					<RichText.Content
						tagName="span"
						className="dcx-cta__button-text"
						value={ buttonText }
					/>
				</a>
			</div>
		);
	},
};

// v1 — bouton avec toggle useThemeButton (classe conditionnelle)
const v1 = {
	attributes: {
		title: { type: 'string', default: 'Vous souhaitez aller plus loin ?' },
		description: { type: 'string', default: 'Recevez la fiche complète…' },
		buttonText: { type: 'string', default: 'En savoir plus' },
		buttonUrl: { type: 'string', default: '' },
		buttonIcon: { type: 'string', default: '✉️' },
		linkTarget: { type: 'boolean', default: false },
		useThemeButton: { type: 'boolean', default: false },
		titleColor: { type: 'string', default: '' },
		titleFontSize: { type: 'string', default: '' },
		descriptionColor: { type: 'string', default: '' },
		descriptionFontSize: { type: 'string', default: '' },
	},
	save( { attributes } ) {
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

		const btnClass =
			'dcx-cta__button' +
			( useThemeButton
				? ' wp-element-button wp-block-button__link'
				: '' );

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
					{ ...( descriptionStyle
						? { style: descriptionStyle }
						: {} ) }
				/>
				<a href={ buttonUrl } className={ btnClass } { ...linkProps }>
					<span className="dcx-cta__button-icon">{ buttonIcon }</span>
					<RichText.Content
						tagName="span"
						className="dcx-cta__button-text"
						value={ buttonText }
					/>
				</a>
			</div>
		);
	},
};

export default [ v2, v1 ];
