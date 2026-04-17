import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import './style.scss';

addFilter(
	'blocks.registerBlockType',
	'dcx/columns-reverse-attribute',
	( settings, name ) => {
		if ( name !== 'core/columns' ) {
			return settings;
		}
		return {
			...settings,
			attributes: {
				...settings.attributes,
				reverseOnMobile: { type: 'boolean', default: false },
			},
		};
	}
);

const withColumnsReverseControl = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if ( props.name !== 'core/columns' ) {
			return <BlockEdit { ...props } />;
		}
		const { attributes, setAttributes } = props;
		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody
						title={ __( 'Mobile', 'dcx-benchmark-luxe' ) }
						initialOpen={ false }
					>
						<ToggleControl
							label={ __(
								"Inverser l'ordre des colonnes sur mobile",
								'dcx-benchmark-luxe'
							) }
							checked={ !! attributes.reverseOnMobile }
							onChange={ ( value ) =>
								setAttributes( { reverseOnMobile: value } )
							}
						/>
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'withColumnsReverseControl' );

addFilter(
	'editor.BlockEdit',
	'dcx/columns-reverse-control',
	withColumnsReverseControl
);

addFilter(
	'blocks.getSaveContent.extraProps',
	'dcx/columns-reverse-class',
	( extraProps, blockType, attributes ) => {
		if ( blockType.name !== 'core/columns' ) {
			return extraProps;
		}
		if ( ! attributes.reverseOnMobile ) {
			return extraProps;
		}
		return {
			...extraProps,
			className: [ extraProps.className, 'has-reverse-on-mobile' ]
				.filter( Boolean )
				.join( ' ' ),
		};
	}
);
