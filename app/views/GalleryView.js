// baliseimage
// 2015
// GalleryView Backbone View
//
define(['underscore', 'jquery', 'backbone','app/router','app/models/GalleryCollection','text!templates/gallery.html','requestAnimationFrame'], function (_, $, Backbone, router, GalleryCollection, template) {
	return Backbone.View.extend({
		type: 'gallery',
		el: '#site',
		events:{
			'click .item':'clickImg',
			'click .use':'useImg'
		},
		initialize:function(){
			console.log('new gallery');
			this.collection = new GalleryCollection();
			this.collection.on('sync',this.render,this);
			this.collection.fetch();
			$(window).on('resize', $.proxy(this.resize,this));
		},
		resize:function(){
			if (_.isUndefined(this.$el.parent().get(0))) {
				return $(window).off('resize', $.proxy(this.resize, this));
			}
			var el = this.$el.find('.gallery').get(0),
				scaleX = $(window).width() / $(el).width(),
				scaleY = $(window).height() / $(el).height(),
				scaleMin = scaleX < scaleY ? scaleX : scaleY,
				scale = scaleMin > 1 ? 1 : scaleMin;
			el.style.webkitTransform = el.style.transform =
				' translate(-640px, -400px) scale(' + scale + ')';
		},
		render:function(){
			var g = this;
			g.collection.start = Date.now();
			this.$el.html($(_.template(template)(this)));
			setTimeout(function(){
				// real start
				g.$el.find('.item').addClass('run');
				g.collection.start = Date.now();
				g.updateFrame();
			},2000)
			this.resize();
		},
		updateFrame:function(){
			this.collection.each(function(item){
				if(!item.img){
					item.img = $('#img-'+item.get('id'));
				}
				item.img.attr('style',item.style())
			});
			window.requestAnimationFrame($.proxy(this.updateFrame,this));
		},
		clickImg:function(e){
			$('.item.focus').not(e.currentTarget).click();
			var id = $(e.currentTarget).attr('id').split('-').pop(),
				model = this.collection.findWhere({id: id});
			model.$div = $(e.currentTarget);
			model.focus();
			//
		},
		useImg:function(e){
			var id = $(e.currentTarget).parent().attr('id').split('-').pop();
			router.navigate('paper/'+id,{trigger:true});
			return false;
		}
	});
});