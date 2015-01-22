// baliseimage
// 2015
// EffectCollection Backbone Model
//
define(['underscore', 'jquery', 'backbone', 'app/models/EffectModel' ,
	'app/models/effects/Blur'
], function (_, $, Backbone, EffectModel, Blur) {
	return Backbone.Collection.extend({
		model: EffectModel,
		initialize:function(){
			//console.log('initialize EffectCollection');
		}
	});
});