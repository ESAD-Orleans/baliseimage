// baliseimage
// 2015
// EffectCollection Backbone Model
//
define(['underscore', 'jquery', 'backbone', 'app/models/EffectModel' ,
	'app/models/effects/Blur',
	'app/models/effects/DragAndDropImages',
	'app/models/effects/Glitch',
	'app/models/effects/Noise'
], function (_, $, Backbone, EffectModel, Blur, DragAndDropImages, Glitch, Noise) {
	return Backbone.Collection.extend({
		model:EffectModel,
		initialize:function(a){
			this.imageModel = a.imageModel;
			console.log('initialize EffectCollection');
		},
		setup:function(){
			console.log('setup EffectCollection');
			this.add([
				Glitch(),
				Blur(),
				DragAndDropImages(),
				Noise()
			]);
		},
		render:function(context,callback) {
			var c = this;
			var i = 0;
			console.group("=== RENDERING STACK ===");

			function next() {
				i++;
				var effect = c.at(i);
				if(effect){
					console.log('- %s render %s', i,effect.get('type'));
					effect.get('render')(c.imageModel,context,next);
				}else if(callback){
					console.groupEnd();
					callback();
				}else{
					console.groupEnd();
				}
			}

			next();
		}

	});
});