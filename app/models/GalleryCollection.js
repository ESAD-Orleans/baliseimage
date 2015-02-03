// baliseimage
// 2015
// Gallery Backbone Collection
//
define(['underscore', 'jquery', 'backbone', 'settings'], function (_, $, Backbone, settings) {

	var GalleryItem = Backbone.Model.extend({
		initialize:function(){
			function r(n){
				return (2*Math.random()-1) * 100 *n;
			}
			this.f = 1;
			this.tX = r(2);
			this.tY = r(1.5);
		},
		image:function(){
			return settings.get('FILE_URL')+this.get('id')+'.jpg';
		},
		index:function(){
			return this.collection ? this.collection.indexOf(this) : -1;
		},
		style:function(){
			var style = '', DIFF = 100, SPEED = .1, c = this.collection,
				time = Date.now() - c.start,
				timeFade = (1-1/(time/5000+1))*time,
				z = (-DIFF*this.index()+ SPEED*(timeFade)%(DIFF* c.size()));
			if(z>0){
				z-= DIFF * c.size();
			}
			if(this.f==1){
				style += 'opacity:' + (z > -100 ? 0 : 1) + ';';
			}
			var t = 'transform:translate3d(' + this.f * this.tX + '%, ' + this.f * this.tY + '%,' + this.f * z + 'px);';
			style += t;
			style += '-webkit-'+t;
			//
			return style;
		},
		focus:function(){
			if (this.f == 0) {
				this.$div.removeClass('focus');
			}
			$(this).stop().animate({f:this.f==0?1:0},function(){
				if(this.f==0){
					this.$div.addClass('focus');
				}
			});
		},
		enumerate: function (f) {
			return _(this.attributes).each(f);
		}
	});

	return Backbone.Collection.extend({
		model:GalleryItem,
		url: 'list.php'
	});
})