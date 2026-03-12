import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import metadata from './block.json';
import Edit from './edit';
import save from './save';
import './style.scss';

// v2 : avec borderTopColor inline (intermédiaire)
const v2 = {
	attributes: metadata.attributes,
	save( { attributes } ) {
		const { number, suffix, suffixPosition, label, accentColor } =
			attributes;
		const blockProps = useBlockProps.save( {
			className: 'dcx-stat-card',
			style: {
				'--dcx-stat-accent': accentColor || 'transparent',
				borderTopColor: accentColor ? 'transparent' : undefined,
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
				{ label && (
					<p className="dcx-stat-card__label">{ label }</p>
				) }
			</div>
		);
	},
};

// v1 : version initiale sans borderTopColor ni has-accent
const v1 = {
	attributes: metadata.attributes,
	save( { attributes } ) {
		const { number, suffix, suffixPosition, label, accentColor } =
			attributes;
		const blockProps = useBlockProps.save( {
			className: 'dcx-stat-card',
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
				{ label && (
					<p className="dcx-stat-card__label">{ label }</p>
				) }
			</div>
		);
	},
};

registerBlockType( metadata.name, {
	edit: Edit,
	save,
	deprecated: [ v2, v1 ],
} );
