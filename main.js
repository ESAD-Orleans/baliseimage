// baliseimage
// 2014
// main RequireJS Module
//
require.config({
	paths:{
		//
		'text':'bower_components/requirejs-plugins/lib/text',
		//
		'jquery':'bower_components/jquery/dist/jquery.min',
		'backbone':'bower_components/backbone/backbone',
		'underscore':'bower_components/underscore/underscore-min',
		//
		'settings':'app/models/settings',
		//
		'dropzone':'bower_components/dropzone/downloads/dropzone-amd-module.min',
		'interact':'bower_components/interact/interact.min',
		'StackBlur':'bower_components/StackBlur/StackBlur',
		'glitch-canvas':'bower_components/glitch-canvas/dist/glitch-canvas.min',
		'seedrandom':'bower_components/seedrandom/seedrandom',
		'requestAnimationFrame':'bower_components/requestAnimationFrame/app/requestAnimationFrame',
		'perlin':'lib/perlin',
		'moment':'bower_components/moment/min/moment-with-locales.min'
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
