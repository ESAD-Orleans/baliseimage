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
			this.tX = r(4);
			this.tY = r(2);
		},
		image:function(){
			return settings.get('FILE_URL')+this.get('id')+'.jpg';
		},
		index:function(){
			return this.collection ? this.collection.indexOf(this) : -1;
		},
		style:function(){
			var style = '', DIFF = 100, SPEED = .1, c = this.collection,
				z = (-DIFF*this.index()+ SPEED*(Date.now()-c.start)%(DIFF* c.size()));
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
		}
	});

	return Backbone.Collection.extend({
		model:GalleryItem,
		url: 'list.php'
	});
})