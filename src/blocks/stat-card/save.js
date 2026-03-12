import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { number, suffix, suffixPosition, label, accentColor } = attributes;

	const blockProps = useBlockProps.save( {
		className: `dcx-stat-card${ accentColor ? ' has-accent' : '' }`,
		style: {
			'--dcx-stat-accent': accentColor || 'transparent',
		},
	} );

	const SuffixTag = suffixPosition === 'sub' ? 'sub' : 'sup';

	return (
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
	);
}
