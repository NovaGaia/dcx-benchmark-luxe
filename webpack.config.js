const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
	entry: async () => ( {
		...( await defaultConfig.entry() ),
		'extensions/columns-reverse/index':
			'./src/extensions/columns-reverse/index.js',
		'extensions/scroll-shadow/index':
			'./src/extensions/scroll-shadow/index.js',
		'extensions/scroll-shadow/view':
			'./src/extensions/scroll-shadow/view.js',
		'extensions/button-popup/index':
			'./src/extensions/button-popup/index.js',
		'extensions/button-popup/view': './src/extensions/button-popup/view.js',
	} ),
};
