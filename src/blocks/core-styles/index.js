import './style.scss';

import domReady from '@wordpress/dom-ready';
import { registerBlockStyle } from '@wordpress/blocks';

const boxStyles = [
	{ name: 'dcx-box', label: 'DCX Shadow' },
	{ name: 'dcx-box-accent-1', label: 'DCX Accent 1' },
	{ name: 'dcx-box-accent-2', label: 'DCX Accent 2' },
	{ name: 'dcx-box-accent-3', label: 'DCX Accent 3' },
	{ name: 'dcx-box-accent-4', label: 'DCX Accent 4' },
	{ name: 'dcx-box-accent-5', label: 'DCX Accent 5' },
	{ name: 'dcx-box-custom-secondary-1', label: 'DCX Secondary 1' },
	{ name: 'dcx-box-custom-secondary-2', label: 'DCX Secondary 2' },
	{ name: 'dcx-box-custom-secondary-3', label: 'DCX Secondary 3' },
	{ name: 'dcx-box-custom-secondary-4', label: 'DCX Secondary 4' },
	{ name: 'dcx-box-custom-secondary-5', label: 'DCX Secondary 5' },
	{ name: 'dcx-box-custom-digit-1', label: 'DCX Digit 1' },
	{ name: 'dcx-box-custom-digit-2', label: 'DCX Digit 2' },
	{ name: 'dcx-box-contrast', label: 'DCX Contrast' },
];

domReady( () => {
	registerBlockStyle( 'core/group', boxStyles );
	registerBlockStyle( 'core/columns', boxStyles );
	registerBlockStyle( 'core/column', boxStyles );
	registerBlockStyle( 'core/stack', boxStyles );
	registerBlockStyle( 'core/grid', boxStyles );
	registerBlockStyle( 'dcx-benchmark-luxe/stat-card', boxStyles );
	registerBlockStyle( 'dcx-benchmark-luxe/charts', boxStyles );
	registerBlockStyle( 'dcx-benchmark-luxe/cta', boxStyles );
} );
