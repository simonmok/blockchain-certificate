requireJS.require.config({
	paths: {
		jquery: 'lib/jquery-3.1.1.slim.min',
		web3: 'lib/web3',
		settings: 'lib/app-config',
		bootstrap: 'lib/bootstrap.min'
	},
	shim: {
		'bootstrap': {
			deps: ['jquery']
		}
	}
});