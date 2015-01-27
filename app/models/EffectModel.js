// baliseimage
// 2015
// EffectModel Backbone Model
//
define(['underscore', 'jquery', 'backbone'], function (_, $, Backbone) {
	return Backbone.Model.extend({
		defaults:{
			'render':function(imageModel,context,next){
				console.log('default renderer, nothing to do…'); next();
			}
		}
	});
});