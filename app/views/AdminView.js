// baliseimage
// 2015
// AdminView Backbone View
//
define(['underscore', 'jquery', 'backbone', 'app/models/GalleryCollection','text!templates/admin.html'], function (_, $, Backbone, GalleryCollection,template) {
	return Backbone.View.extend({
		el:'#site',
		type:'admin',
		events:{
			'click .title':'toggleAccordion'
		},
		initialize:function(){
			console.log('AdminView');
			this.collection = new GalleryCollection();
			this.collection.on('sync',this.render,this);
			this.collection.on('error',this.error,this);
			this.testPassword(true);
		},
		testPassword:function(force){
			if(!force){
				var password = prompt('avez vous le mot de passe ?');
				if (!password) {
					return Backbone.history.navigate('', {trigger: true});
				}
				if (password == '') {
					password = 'wrong'
				}
				this.collection.url = 'list.php?password=' + password + '&';
			}else{
				this.collection.url = 'list.php?password=arcenf2015';
			}
			this.collection.fetch();
		},
		render:function(){
			this.$el.html(_.template(template)(this.collection));
		},
		error:function(c,e){
			this.testPassword();
		},
		toggleAccordion:function(e){
			this.$el.find('.file .options').stop().slideUp();
			$('+ .options', e.currentTarget).stop().slideDown();
		}
	});
});