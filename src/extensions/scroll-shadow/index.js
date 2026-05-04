import { __ } from '@wordpress/i18n';
import './style.scss';
import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';

const SUPPORTED_BLOCKS = [
	'core/group',
	'core/cover',
	'core/columns',
	'core/column',
];

const isSupported = ( name ) => SUPPORTED_BLOCKS.includes( name );

addFilter(
	'blocks.registerBlockType',
	'dcx/scroll-shadow-attribute',
	( settings, name ) => {
		if ( ! isSupported( name ) ) {
			return settings;
		}
		return {
			...settings,
			attributes: {
				...settings.attributes,
				hasScrollShadow: { type: 'boolean', default: false },
			},
		};
	}
);

const withScrollShadowControl = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if ( ! isSupported( props.name ) ) {
			return <BlockEdit { ...props } />;
		}
		const { attributes, setAttributes } = props;
		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody
						title={ __( 'Effets', 'dcx-benchmark-luxe' ) }
						initialOpen={ false }
					>
						<ToggleControl
							label={ __(
								'Ombre au scroll',
								'dcx-benchmark-luxe'
							) }
							checked={ !! attributes.hasScrollShadow }
							onChange={ ( value ) =>
								setAttributes( { hasScrollShadow: value } )
							}
						/>
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'withScrollShadowControl' );

addFilter(
	'editor.BlockEdit',
	'dcx/scroll-shadow-control',
	withScrollShadowControl
);

const withScrollShadowEditorClass = createHigherOrderComponent(
	( BlockListBlock ) => {
		return ( props ) => {
			if (
				! isSupported( props.name ) ||
				! props.attributes.hasScrollShadow
			) {
				return <BlockListBlock { ...props } />;
			}
			const extraClass = [ props.className, 'has-scroll-shadow' ]
				.filter( Boolean )
				.join( ' ' );
			return <BlockListBlock { ...props } className={ extraClass } />;
		};
	},
	'withScrollShadowEditorClass'
);

addFilter(
	'editor.BlockListBlock',
	'dcx/scroll-shadow-editor-class',
	withScrollShadowEditorClass
);

addFilter(
	'blocks.getSaveContent.extraProps',
	'dcx/scroll-shadow-class',
	( extraProps, blockType, attributes ) => {
		if ( ! isSupported( blockType.name ) ) {
			return extraProps;
		}
		if ( ! attributes.hasScrollShadow ) {
			return extraProps;
		}
		return {
			...extraProps,
			className: [ extraProps.className, 'has-scroll-shadow' ]
				.filter( Boolean )
				.join( ' ' ),
		};
	}
);
