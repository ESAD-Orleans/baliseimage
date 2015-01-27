// baliseimage
// 2015
// ImageModel Backbone Model
//
define(['underscore', 'jquery', 'backbone','app/models/EffectCollection'], function (_, $, Backbone, EffectCollection) {
	return Backbone.Model.extend({
		initialize:function(){
			this.image = new Image();
			$(this.image).on('load', $.proxy(this.loadImage,this));
			this.effects = new EffectCollection({imageModel:this});
			this.effects.setup();
			this.on('change:image',this.changeImage,this);
		},
		changeImage:function(m,v){
			m.image.src = v;
		},
		loadImage:function(){
			this.trigger('load:image');
		},
		render:function(context){
			context.drawImage(this.image, 0, 0);
			this.effects.render(context);

		}
	});
});