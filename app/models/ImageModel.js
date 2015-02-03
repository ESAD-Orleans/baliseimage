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
		render:function(context,callback){
			context.drawImage(this.image, 0, 0);
			this.effects.render(context,callback);

		},
		parseData:function(){
			var datas = {date: Date.now()};

			_(this.attributes).each(function (val, id) {
				switch (typeof(val)) {
					case 'string':
					case 'number':
						datas[id] = val;
						break;
				}
			})

			return datas;
		},
		saveModel:function(callback,imageData){
			console.log('saveModel');
			var m = this;
			if (imageData) {
				console.log('image data saved');
				m.set('imageData', imageData)
			}
			_(m.attributes).each(function (v, n) {
				console.log('save %s : %s', n, v);
			});
			$.ajax({
				url: 'post.php',
				method: 'POST',
				dataType: 'json',
				data: m.parseData(),
				success: function (r) {
					//
					//
					_(r).each(function(v,n){
						console.log('set %s : %s',n,v);
						m.set(n,v);
					});
					m.unset('imageData');
					if (callback) {
						callback(r);
					}
				}
			})
		}
	});
});