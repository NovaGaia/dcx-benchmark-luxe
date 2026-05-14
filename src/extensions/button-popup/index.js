import './style.scss';

( function () {
	const { __ } = wp.i18n;
	const { addFilter } = wp.hooks;
	const { InspectorControls } = wp.blockEditor;
	const { PanelBody, ToggleControl, TextControl } = wp.components;
	const { createHigherOrderComponent } = wp.compose;

	const HUBSPOT_REGEX = /https?:\/\/[a-z0-9-]+\.hsforms\.com\//;

	function isHubspotUrl( url ) {
		if ( ! url ) {
			return false;
		}
		return HUBSPOT_REGEX.test( url );
	}

	// 1. Add attributes to core/button
	addFilter(
		'blocks.registerBlockType',
		'dcx/button-popup-attribute',
		( settings, name ) => {
			if ( name !== 'core/button' ) {
				return settings;
			}

			return {
				...settings,
				attributes: {
					...settings.attributes,
					hasPopup: {
						type: 'boolean',
						default: false,
					},
					popupUrl: {
						type: 'string',
						default: '',
					},
				},
			};
		}
	);

	// 2. Add InspectorControls to button block
	const withPopupControl = createHigherOrderComponent( ( BlockEdit ) => {
		return ( props ) => {
			if ( props.name !== 'core/button' ) {
				return <BlockEdit { ...props } />;
			}

			const { attributes, setAttributes } = props;
			const { hasPopup, popupUrl } = attributes;

			const linkUrl = attributes.url || '';
			const isHubspot = isHubspotUrl( linkUrl );

			let popupHelp;
			if ( hasPopup ) {
				popupHelp = __(
					"Le formulaire s'affichera dans une popin au clic",
					'dcx-benchmark-luxe'
				);
			} else if ( isHubspot ) {
				popupHelp = __(
					'URL HubSpot détectée — activation recommandée',
					'dcx-benchmark-luxe'
				);
			}

			const handleChangePopup = ( value ) => {
				setAttributes( { hasPopup: value } );
				if ( ! value ) {
					setAttributes( { popupUrl: '' } );
				}
			};

			const handleChangeUrl = ( value ) => {
				setAttributes( { popupUrl: value } );
			};

			return (
				<>
					<BlockEdit { ...props } />
					<InspectorControls>
						<PanelBody
							title={ __(
								'Popin formulaire',
								'dcx-benchmark-luxe'
							) }
							initialOpen={ false }
						>
							<ToggleControl
								label={ __(
									'Afficher en popin',
									'dcx-benchmark-luxe'
								) }
								checked={ !! hasPopup }
								onChange={ handleChangePopup }
								help={ popupHelp }
							/>
							{ hasPopup && (
								<TextControl
									__next40pxDefaultSize
									label={ __(
										'URL du formulaire',
										'dcx-benchmark-luxe'
									) }
									value={ popupUrl || linkUrl }
									onChange={ handleChangeUrl }
									help={
										! popupUrl
											? __(
													'Défaut : URL du bouton',
													'dcx-benchmark-luxe'
											  )
											: undefined
									}
								/>
							) }
						</PanelBody>
					</InspectorControls>
				</>
			);
		};
	}, 'withPopupControl' );

	addFilter(
		'editor.BlockEdit',
		'dcx/button-popup-control',
		withPopupControl
	);

	// 3. Add class in editor
	const withPopupEditorClass = createHigherOrderComponent(
		( BlockListBlock ) => {
			return ( props ) => {
				if (
					props.name !== 'core/button' ||
					! props.attributes.hasPopup
				) {
					return <BlockListBlock { ...props } />;
				}

				const extraClass = [ props.className, 'has-popup' ]
					.filter( Boolean )
					.join( ' ' );
				return <BlockListBlock { ...props } className={ extraClass } />;
			};
		},
		'withPopupEditorClass'
	);

	addFilter(
		'editor.BlockListBlock',
		'dcx/button-popup-editor-class',
		withPopupEditorClass
	);

	// 4. Add class to saved markup
	addFilter(
		'blocks.getSaveContent.extraProps',
		'dcx/button-popup-class',
		( extraProps, blockType, attributes ) => {
			if ( blockType.name !== 'core/button' || ! attributes.hasPopup ) {
				return extraProps;
			}

			return {
				...extraProps,
				className: [ extraProps.className, 'has-popup' ]
					.filter( Boolean )
					.join( ' ' ),
				'data-popup-url': attributes.popupUrl || attributes.url || '',
			};
		}
	);
} )();
