// baliseimage
// 2015
// EffectCollection Backbone Model
//
define(['underscore', 'jquery', 'backbone', 'app/models/EffectModel' ,
	'app/models/effects/Blur',
	'app/models/effects/DragAndDropImages'
], function (_, $, Backbone, EffectModel, Blur, DragAndDropImages) {
	return Backbone.Collection.extend({
		model:EffectModel,
		initialize:function(a){
			this.imageModel = a.imageModel;
			console.log('initialize EffectCollection');
		},
		setup:function(){
			console.log('setup EffectCollection');
			this.add([Blur(), DragAndDropImages()]);
		},
		render:function(context,callback) {
			var c = this;
			var i = 0;

			function next() {
				i++;
				var effect = c.at(i);
				if(effect){
					console.log('=== render '+effect.get('type')+' ===');
					effect.get('render')(c.imageModel,context,next);
				}else if(callback){
					callback();
				}
			}

			next();
		}

	});
});