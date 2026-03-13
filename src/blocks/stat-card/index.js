import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import metadata from './block.json';
import Edit from './edit';
import save from './save';
import './style.scss';

const deprecations = [
	{
		attributes: {
			number: { type: 'string', default: '' },
			suffix: { type: 'string', default: '' },
			suffixPosition: { type: 'string', default: 'sup' },
			label: { type: 'string', default: '' },
			accentColor: { type: 'string', default: '' },
			numberColor: { type: 'string', default: '' },
			numberFontSize: { type: 'string', default: '' },
			labelColor: { type: 'string', default: '' },
			labelFontSize: { type: 'string', default: '' },
		},
		save( { attributes } ) {
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
					<p
						className="dcx-stat-card__number"
						style={ {
							color: numberColor || undefined,
							fontSize: numberFontSize || undefined,
						} }
					>
						{ number }
						{ suffix && (
							<SuffixTag className="dcx-stat-card__suffix">
								{ suffix }
							</SuffixTag>
						) }
					</p>
					{ label && (
						<p
							className="dcx-stat-card__label"
							style={ {
								color: labelColor || undefined,
								fontSize: labelFontSize || undefined,
							} }
						>
							{ label }
						</p>
					) }
				</div>
			);
		},
	},
];

registerBlockType( metadata.name, {
	edit: Edit,
	save,
	deprecations,
} );
