// baliseimage
// 2015
// AdminView Backbone View
//
define(['underscore', 'jquery', 'backbone', 'app/models/GalleryCollection','text!templates/admin.html','moment'], function (_, $, Backbone, GalleryCollection,template, moment) {

	return Backbone.View.extend({
		el:'#site',
		type:'admin',
		events:{
			'click .title':'toggleAccordion',
			'change input':'updateFilters'
		},
		initialize:function(){
			console.log('AdminView');
			this.collection = new GalleryCollection();
			this.collection.on('sync',this.render,this);
			this.collection.on('error',this.error,this);
			this.collection.comparator = 'date';
			this.testPassword();
		},
		testPassword:function(){
			//
			var password = prompt('avez vous le mot de passe ?');
			if (!password) {
				return Backbone.history.navigate('', {trigger: true});
			}
			if (password == '') {
				password = 'wrong'
			}
			this.collection.url = 'list.php?password=' + password + '&';
			//
			this.collection.fetch();
		},
		render:function(){
			var c = this.collection;
			c.filtred = _(_(this.collection.filter(function(a,b){
				return c.iterations[a.get('iteration')-1] && (!a.isGallery() || c.filterGallery) && (a.isGallery() || c.filterNotGallery);
				//	&& (c.filterNotGallery || a.isGallery())

			})).sortBy(function(f){return -f.get('date')}));
			this.$el.html(_.template(template)(this.collection));
		},
		error:function(c,e){
			this.testPassword();
		},
		updateFilters:function(){
			var c = this.collection;
			$('.filters .iteration :checkbox').each(function (i,v) {
				c.iterations[i] = $(v).is(':checked');
			});
			c.filterGallery = $('.filter-gallery :checkbox').is(':checked')
			c.filterNotGallery = $('.filter-not-gallery :checkbox').is(':checked');
			this.render();
		},
		toggleAccordion:function(e){
			this.$el.find('.file .options').stop().slideUp();
			$('+ .options', e.currentTarget).stop().slideToggle();
		}
	});
});