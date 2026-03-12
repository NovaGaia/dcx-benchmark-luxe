import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Rendu statique sauvegardé en base de données.
 *
 * @param {Object} props            - Propriétés du bloc.
 * @param {Object} props.attributes - Attributs du bloc.
 */
export default function save( { attributes } ) {
	const blockProps = useBlockProps.save();
	const { content } = attributes;

	return (
		<div { ...blockProps }>
			<RichText.Content tagName="p" value={ content } />
		</div>
	);
}
