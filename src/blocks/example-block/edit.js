import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Composant d'édition du bloc (affiché dans l'éditeur Gutenberg).
 *
 * @param {Object}   props               - Propriétés du bloc.
 * @param {Object}   props.attributes    - Attributs du bloc.
 * @param {Function} props.setAttributes - Fonction de mise à jour des attributs.
 */
export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();
	const { content } = attributes;

	return (
		<div { ...blockProps }>
			<RichText
				tagName="p"
				value={ content }
				onChange={ ( value ) => setAttributes( { content: value } ) }
				placeholder={ __( 'Saisissez votre contenu…', 'dcx-benchmark-luxe' ) }
			/>
		</div>
	);
}
