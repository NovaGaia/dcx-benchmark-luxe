import './style.scss';

import domReady from '@wordpress/dom-ready';
import { registerBlockStyle } from '@wordpress/blocks';

const boxStyles = [
	{ name: 'dcx-box', label: 'DCX Shadow' },
	...[ 1, 2, 3, 4, 5, 6 ].map( ( n ) => ( {
		name: `dcx-box-accent-${ n }`,
		label: `DCX Shadow Accent ${ n }`,
	} ) ),
];

domReady( () => {
	registerBlockStyle( 'core/group', boxStyles );
	registerBlockStyle( 'core/columns', boxStyles );
	registerBlockStyle( 'core/column', boxStyles );
	registerBlockStyle( 'core/stack', boxStyles );
	registerBlockStyle( 'core/grid', boxStyles );
	registerBlockStyle( 'dcx-benchmark-luxe/stat-card', boxStyles );
	registerBlockStyle( 'dcx-benchmark-luxe/charts', boxStyles );
} );
