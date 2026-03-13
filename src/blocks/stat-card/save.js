import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
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

	const blockProps = useBlockProps.save( {
		className: `dcx-stat-card${ accentColor ? ' has-accent' : '' }`,
		style: {
			'--dcx-stat-accent': accentColor || 'transparent',
		},
	} );

	const SuffixTag = suffixPosition === 'sub' ? 'sub' : 'sup';

	return (
		<div { ...blockProps }>
			<div
				className="dcx-stat-card__number"
				style={ {
					color: numberColor || undefined,
					fontSize: numberFontSize || undefined,
				} }
			>
				<RichText.Content tagName="span" value={ number } />
				{ suffix && (
					<SuffixTag className="dcx-stat-card__suffix">
						{ suffix }
					</SuffixTag>
				) }
			</div>
			{ label && (
				<RichText.Content
					tagName="p"
					className="dcx-stat-card__label"
					value={ label }
					style={ {
						color: labelColor || undefined,
						fontSize: labelFontSize || undefined,
					} }
				/>
			) }
		</div>
	);
}
