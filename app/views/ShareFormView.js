// baliseimage
// 2015
// UploadView Backbone View
//
define(['underscore', 'jquery', 'backbone','app/router','text!templates/shareform.html','text!templates/shareformcomplete.html','settings'], function (_, $, Backbone, router, template, templateComplete, settings) {
	return Backbone.View.extend({
		el:'.shareform',
		events:{
			'submit form':'submitForm',
			'click a':'navigate'
		},
		initialize:function(imageModel){
			this.imageModel = imageModel;
			console.log('New ShareFormView %s', imageModel.get('sharing-id'));
			this.render();
			this.saveModel();
		},
		render:function(){
			this.$el.html(_.template(
				this.imageModel.get('username')? templateComplete:template
			)(this.imageModel));
		},
		navigate:function(e){
			router.navigate($(e.currentTarget).attr('href'),{trigger:true});
		},
		saveModel:function(){
			var view=this,datas = {};

			_(this.imageModel.attributes).each(function(val,id){
				switch(typeof(val)){
					case 'string':
					case 'number':
					datas[id] = val;
						break;
				}
			})

			$.ajax({
				url: 'post.php',
				method: 'POST',
				dataType: 'json',
				data: datas,
				success: function (r) {
					//
					view.render();
				}
			})
		},
		submitForm:function(e){
			e.preventDefault();
			var error = {}, imageModel = this.imageModel;
			this.$el.find('input:text').each(function(){
				var i = $(this),
					id = i.attr('id'),
					val = i.val();
				if(!val){error[id]=typeof(val)}else{
					imageModel.set(id,val);
				}
			});
			if(_(error).size()>0){
				return false;
			}
			this.saveModel();
		}
	});
});