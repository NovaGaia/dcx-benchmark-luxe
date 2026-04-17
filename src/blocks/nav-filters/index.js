import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import {
	InspectorControls,
	PanelColorSettings,
	ColorPalette,
	useSettings,
} from '@wordpress/block-editor';
import { PanelBody, Button, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Fragment, useRef, useEffect } from '@wordpress/element';

const BLOCK_NAME = 'core/navigation';
const STORAGE_KEY = 'dcx-nav-item-style';

const STYLE_ATTRS = [
	'navItemBg',
	'navItemBgHover',
	'navItemColorHover',
	'navItemBorderColor',
	'navItemBorderColorTop',
	'navItemBorderColorRight',
	'navItemBorderColorBottom',
	'navItemBorderColorLeft',
	'navItemBorderColorLinked',
	'navItemActiveBg',
	'navItemActiveColor',
];

const VAR_MAP = {
	navItemBg: '--nav-item-bg',
	navItemBgHover: '--nav-item-bg-hover',
	navItemColorHover: '--nav-item-color-hover',
	navItemBorderColor: '--nav-item-border-color',
	navItemBorderColorTop: '--nav-item-border-color-top',
	navItemBorderColorRight: '--nav-item-border-color-right',
	navItemBorderColorBottom: '--nav-item-border-color-bottom',
	navItemBorderColorLeft: '--nav-item-border-color-left',
	navItemActiveBg: '--nav-item-active-bg',
	navItemActiveColor: '--nav-item-active-color',
};

/**
 * Si le hex correspond à une couleur du thème, retourne la CSS var WordPress.
 * Sinon retourne la valeur telle quelle.
 * @param {string} hex    Valeur hexadécimale de la couleur.
 * @param {Array}  colors Palette de couleurs du thème.
 * @return {string} CSS var ou valeur hex d'origine.
 */
function hexToVar( hex, colors ) {
	if ( ! hex || ! colors ) {
		return hex;
	}
	const match = colors.find(
		( c ) => c.color?.toLowerCase() === hex.toLowerCase()
	);
	return match ? `var(--wp--preset--color--${ match.slug })` : hex;
}

/**
 * Si la valeur est une var() WordPress, résout vers le hex pour l'affichage
 * dans le color picker (sélection du bon swatch).
 * @param {string} value  Valeur CSS ou var() WordPress.
 * @param {Array}  colors Palette de couleurs du thème.
 * @return {string} Valeur hex ou valeur d'origine.
 */
function resolveToHex( value, colors ) {
	if ( ! value || ! colors ) {
		return value;
	}
	const varMatch = value.match( /var\(--wp--preset--color--([^)]+)\)/ );
	if ( varMatch ) {
		return colors.find( ( c ) => c.slug === varMatch[ 1 ] )?.color ?? value;
	}
	return value;
}

/**
 * Convertit le format interne WP `var:preset|TYPE|SLUG` en CSS valide.
 * @param {string} value Valeur potentiellement en format interne WP.
 * @return {string} Valeur avec les références de preset résolues en CSS valide.
 */
function resolveWpPresetVar( value ) {
	if ( ! value ) {
		return value;
	}
	return String( value ).replace(
		/var:preset\|([^|\s]+)\|([^|\s;]+)/g,
		'var(--wp--preset--$1--$2)'
	);
}

/**
 * Panneau de contrôles couleurs pour les items de navigation.
 * @param {Object}   root0               Props du composant.
 * @param {Object}   root0.attributes    Attributs du bloc.
 * @param {Function} root0.setAttributes Fonction de mise à jour des attributs.
 * @return {JSX.Element} Panneau InspectorControls.
 */
function NavItemInspectorControls( { attributes, setAttributes } ) {
	const {
		navItemBg,
		navItemBgHover,
		navItemColorHover,
		navItemBorderColor,
		navItemBorderColorTop,
		navItemBorderColorLinked,
		navItemActiveBg,
		navItemActiveColor,
	} = attributes;

	const [ colorPalette ] = useSettings( 'color.palette' );
	const safeColors = Array.isArray( colorPalette ) ? colorPalette : [];

	const setColor = ( key ) => ( value ) =>
		setAttributes( {
			[ key ]: value ? hexToVar( value, safeColors ) : '',
		} );

	const copyStyle = () => {
		const style = {};
		STYLE_ATTRS.forEach( ( key ) => {
			style[ key ] = attributes[ key ];
		} );
		window.localStorage.setItem( STORAGE_KEY, JSON.stringify( style ) );
	};

	const pasteStyle = () => {
		try {
			const saved = JSON.parse(
				window.localStorage.getItem( STORAGE_KEY ) || '{}'
			);
			if ( Object.keys( saved ).length ) {
				setAttributes( saved );
			}
		} catch ( e ) {}
	};

	return (
		<InspectorControls group="styles">
			<PanelColorSettings
				title={ __( 'Couleurs des items', 'dcx-benchmark-luxe' ) }
				initialOpen={ false }
				disableCustomColors={ true }
				disableCustomGradients={ true }
				colorSettings={ [
					{
						label: __( 'Fond', 'dcx-benchmark-luxe' ),
						value: resolveToHex( navItemBg, safeColors ),
						onChange: setColor( 'navItemBg' ),
						colors: safeColors,
					},
					{
						label: __( 'Fond (survol)', 'dcx-benchmark-luxe' ),
						value: resolveToHex( navItemBgHover, safeColors ),
						onChange: setColor( 'navItemBgHover' ),
						colors: safeColors,
					},
					{
						label: __( 'Texte (survol)', 'dcx-benchmark-luxe' ),
						value: resolveToHex( navItemColorHover, safeColors ),
						onChange: setColor( 'navItemColorHover' ),
						colors: safeColors,
					},
					{
						label: __( 'Fond actif', 'dcx-benchmark-luxe' ),
						value: resolveToHex( navItemActiveBg, safeColors ),
						onChange: setColor( 'navItemActiveBg' ),
						colors: safeColors,
					},
					{
						label: __( 'Texte actif', 'dcx-benchmark-luxe' ),
						value: resolveToHex( navItemActiveColor, safeColors ),
						onChange: setColor( 'navItemActiveColor' ),
						colors: safeColors,
					},
				] }
			/>
			<PanelBody
				title={ __( 'Couleur de bordure', 'dcx-benchmark-luxe' ) }
				initialOpen={ false }
			>
				<ToggleControl
					label={ __( 'Lier les côtés', 'dcx-benchmark-luxe' ) }
					checked={ navItemBorderColorLinked !== false }
					onChange={ ( val ) => {
						if ( val ) {
							setAttributes( {
								navItemBorderColorLinked: true,
								navItemBorderColor:
									navItemBorderColorTop || navItemBorderColor,
								navItemBorderColorTop: '',
								navItemBorderColorRight: '',
								navItemBorderColorBottom: '',
								navItemBorderColorLeft: '',
							} );
						} else {
							setAttributes( {
								navItemBorderColorLinked: false,
								navItemBorderColorTop: navItemBorderColor,
								navItemBorderColorRight: navItemBorderColor,
								navItemBorderColorBottom: navItemBorderColor,
								navItemBorderColorLeft: navItemBorderColor,
								navItemBorderColor: '',
							} );
						}
					} }
				/>
				{ navItemBorderColorLinked !== false ? (
					<>
						<p
							style={ {
								marginBottom: '4px',
								fontSize: '11px',
								textTransform: 'uppercase',
							} }
						>
							{ __( 'Tous les côtés', 'dcx-benchmark-luxe' ) }
						</p>
						<ColorPalette
							value={ resolveToHex(
								navItemBorderColor,
								safeColors
							) }
							onChange={ setColor( 'navItemBorderColor' ) }
							colors={ safeColors }
							disableCustomColors={ true }
							clearable={ true }
						/>
					</>
				) : (
					<div
						style={ {
							display: 'flex',
							flexDirection: 'column',
							gap: '16px',
						} }
					>
						{ [
							[
								'navItemBorderColorTop',
								__( 'Haut', 'dcx-benchmark-luxe' ),
							],
							[
								'navItemBorderColorRight',
								__( 'Droite', 'dcx-benchmark-luxe' ),
							],
							[
								'navItemBorderColorBottom',
								__( 'Bas', 'dcx-benchmark-luxe' ),
							],
							[
								'navItemBorderColorLeft',
								__( 'Gauche', 'dcx-benchmark-luxe' ),
							],
						].map( ( [ key, label ] ) => (
							<div key={ key }>
								<p
									style={ {
										marginBottom: '4px',
										fontSize: '11px',
										textTransform: 'uppercase',
									} }
								>
									{ label }
								</p>
								<ColorPalette
									value={ resolveToHex(
										attributes[ key ],
										safeColors
									) }
									onChange={ setColor( key ) }
									colors={ safeColors }
									disableCustomColors={ true }
									clearable={ true }
								/>
							</div>
						) ) }
					</div>
				) }
			</PanelBody>
			<PanelBody
				title={ __( 'Style', 'dcx-benchmark-luxe' ) }
				initialOpen={ false }
			>
				<div style={ { display: 'flex', gap: '8px' } }>
					<Button variant="secondary" onClick={ copyStyle }>
						{ __( 'Copier le style', 'dcx-benchmark-luxe' ) }
					</Button>
					<Button variant="secondary" onClick={ pasteStyle }>
						{ __( 'Coller le style', 'dcx-benchmark-luxe' ) }
					</Button>
				</div>
			</PanelBody>
		</InspectorControls>
	);
}

// 1. Ajouter les attributs couleur custom à core/navigation et activer les supports
//    natifs border (radius, width) et spacing.padding avec __experimentalSkipSerialization.
//    La couleur de bordure est gérée via l'attribut custom navItemBorderColor.
addFilter(
	'blocks.registerBlockType',
	'dcx/nav-item-attributes',
	( settings, name ) => {
		if ( name !== BLOCK_NAME ) {
			return settings;
		}
		return {
			...settings,
			attributes: {
				...settings.attributes,
				navItemBg: { type: 'string', default: '' },
				navItemBgHover: { type: 'string', default: '' },
				navItemColorHover: { type: 'string', default: '' },
				navItemBorderColor: { type: 'string', default: '' },
				navItemBorderColorTop: { type: 'string', default: '' },
				navItemBorderColorRight: { type: 'string', default: '' },
				navItemBorderColorBottom: { type: 'string', default: '' },
				navItemBorderColorLeft: { type: 'string', default: '' },
				navItemBorderColorLinked: { type: 'boolean', default: true },
				navItemActiveBg: { type: 'string', default: '' },
				navItemActiveColor: { type: 'string', default: '' },
			},
			supports: {
				...settings.supports,
				shadow: true,
				border: {
					...( settings.supports?.border ?? {} ),
					color: false,
				},
				__experimentalBorder: {
					color: false,
					radius: true,
					style: false,
					width: true,
					__experimentalDefaultControls: {
						radius: true,
						width: true,
					},
					__experimentalSkipSerialization: [ 'radius', 'width' ],
				},
				spacing: {
					...( settings.supports?.spacing ?? {} ),
					padding: true,
					__experimentalSkipSerialization: [ 'padding' ],
				},
			},
		};
	}
);

// 2. Injecter les CSS vars dans le canvas éditeur.
function NavBlockEditorStyles( { clientId, attributes } ) {
	const ref = useRef( null );

	useEffect( () => {
		if ( ! ref.current ) {
			return;
		}

		const doc = ref.current.ownerDocument;
		const styleId = `dcx-nav-vars-${ clientId }`;
		doc.getElementById( styleId )?.remove();

		// CSS vars couleurs custom (inclut navItemBorderColor → --nav-item-border-color)
		const colorVarDecls = Object.entries( VAR_MAP )
			.filter( ( [ attr ] ) => attributes[ attr ] )
			.map(
				( [ attr, cssVar ] ) => `${ cssVar }: ${ attributes[ attr ] }`
			);

		// CSS var depuis le support natif shadow
		const shadow = attributes?.style?.shadow ?? '';
		const nativeShadowVars = shadow
			? [ `--nav-item-shadow: ${ resolveWpPresetVar( shadow ) }` ]
			: [];

		// CSS vars depuis le support natif border (width, radius)
		const border = attributes?.style?.border ?? {};
		const nativeBorderVars = [];
		if ( border.width ) {
			nativeBorderVars.push(
				`--nav-item-border-size: ${ border.width }`
			);
		}
		if ( border.radius ) {
			const radius =
				typeof border.radius === 'object'
					? `${ resolveWpPresetVar(
							border.radius.topLeft ?? '0'
					  ) } ${ resolveWpPresetVar(
							border.radius.topRight ?? '0'
					  ) } ${ resolveWpPresetVar(
							border.radius.bottomRight ?? '0'
					  ) } ${ resolveWpPresetVar(
							border.radius.bottomLeft ?? '0'
					  ) }`
					: resolveWpPresetVar( border.radius );
			nativeBorderVars.push( `--nav-item-radius: ${ radius }` );
		}

		// CSS vars depuis le support natif spacing.padding
		const pad = attributes?.style?.spacing?.padding ?? {};
		const nativePaddingVars = [
			pad.top &&
				`--nav-item-padding-top: ${ resolveWpPresetVar( pad.top ) }`,
			pad.right &&
				`--nav-item-padding-right: ${ resolveWpPresetVar(
					pad.right
				) }`,
			pad.bottom &&
				`--nav-item-padding-bottom: ${ resolveWpPresetVar(
					pad.bottom
				) }`,
			pad.left &&
				`--nav-item-padding-left: ${ resolveWpPresetVar( pad.left ) }`,
		].filter( Boolean );

		const allVarDecls = [
			...colorVarDecls,
			...nativeShadowVars,
			...nativeBorderVars,
			...nativePaddingVars,
		];

		if ( ! allVarDecls.length ) {
			return;
		}

		const varDeclarations = allVarDecls.join( '; ' );
		const navSel = `[data-block="${ clientId }"].wp-block-navigation`;
		const itemSel = `[data-block="${ clientId }"] .wp-block-navigation-item__content`;

		const {
			navItemBg,
			navItemBgHover,
			navItemColorHover,
			navItemBorderColor,
			navItemBorderColorTop,
			navItemBorderColorRight,
			navItemBorderColorBottom,
			navItemBorderColorLeft,
		} = attributes;

		// Règles directes sur les items pour le rendu éditeur
		const itemDecls = [
			navItemBg && `background-color: var(--nav-item-bg)`,
			shadow && `box-shadow: var(--nav-item-shadow)`,
			border.radius && `border-radius: var(--nav-item-radius)`,
			border.width &&
				`border-width: var(--nav-item-border-size); border-style: solid; border-color: var(--nav-item-border-color, transparent)`,
			( pad.top || pad.bottom ) &&
				`padding-top: var(--nav-item-padding-top); padding-bottom: var(--nav-item-padding-bottom)`,
			( pad.left || pad.right ) &&
				`padding-left: var(--nav-item-padding-left); padding-right: var(--nav-item-padding-right)`,
		]
			.filter( Boolean )
			.join( '; ' );

		const css = [
			`${ navSel } { ${ varDeclarations }; }`,
			itemDecls ? `${ itemSel } { ${ itemDecls }; }` : '',
			navItemBgHover || navItemColorHover
				? `${ itemSel }:hover { ${ [
						navItemBgHover &&
							`background-color: var(--nav-item-bg-hover)`,
						navItemColorHover &&
							`color: var(--nav-item-color-hover)`,
				  ]
						.filter( Boolean )
						.join( '; ' ) }; }`
				: '',
			navItemBorderColor
				? `${ itemSel } { border-color: var(--nav-item-border-color); }`
				: '',
			navItemBorderColorTop ||
			navItemBorderColorRight ||
			navItemBorderColorBottom ||
			navItemBorderColorLeft
				? `${ itemSel } { border-top-color: var(--nav-item-border-color-top, transparent); border-right-color: var(--nav-item-border-color-right, transparent); border-bottom-color: var(--nav-item-border-color-bottom, transparent); border-left-color: var(--nav-item-border-color-left, transparent); }`
				: '',
		]
			.filter( Boolean )
			.join( '\n' );

		const style = doc.createElement( 'style' );
		style.id = styleId;
		style.textContent = css;
		doc.head.appendChild( style );

		return () => {
			doc.getElementById( styleId )?.remove();
		};
	} );

	return (
		<span ref={ ref } style={ { display: 'none' } } aria-hidden="true" />
	);
}

const withNavItemControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if ( props.name !== BLOCK_NAME ) {
			return <BlockEdit { ...props } />;
		}

		const { attributes, setAttributes, clientId } = props;

		return (
			<Fragment>
				<BlockEdit { ...props } />
				<NavItemInspectorControls
					attributes={ attributes }
					setAttributes={ setAttributes }
				/>
				<NavBlockEditorStyles
					clientId={ clientId }
					attributes={ attributes }
				/>
			</Fragment>
		);
	};
}, 'withNavItemControls' );

addFilter( 'editor.BlockEdit', 'dcx/nav-item-controls', withNavItemControls );
