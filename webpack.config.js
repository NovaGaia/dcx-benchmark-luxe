const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
	entry: async () => ( {
		...( await defaultConfig.entry() ),
		'extensions/columns-reverse/index':
			'./src/extensions/columns-reverse/index.js',
	} ),
};
