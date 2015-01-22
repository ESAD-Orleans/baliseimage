// baliseimage
// 2014
// main RequireJS Module
//
require.config({
	paths:{
		'jquery':'bower_components/jquery/dist/jquery.min',
		'backbone':'bower_components/backbone/backbone',
		'underscore':'bower_components/underscore/underscore-min',
		//
		'dropzone':'bower_components/dropzone/downloads/dropzone-amd-module.min',
		'interact':'bower_components/interact/interact.min',
		'StackBlur':'bower_components/StackBlur/StackBlur',
		'glitch-canvas':'bower_components/glitch-canvas/dist/glitch-canvas.min'
		//
	},
	shim:{
		'jquery':{
			exports:'$'
		},
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'dropzone':{
			deps: ['jquery']
		}
	}
})
require(['app/main']);
