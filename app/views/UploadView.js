// baliseimage
// 2015
// UploadView Backbone View
//
define(['underscore', 'jquery', 'backbone','text!templates/upload.html', 'dropzone'], function (_, $, Backbone, template) {
	return Backbone.View.extend({
		el:'.uploader',
		events:{
			'click a':'link'
		},
		initialize:function(){
			this.render();
		},
		link:function(e){
			Backbone.history.navigate($(e.currentTarget).attr('href'),{trigger:true})
			return false;
		},
		render:function(){
			this.$el.html(_.template(template)());
			//
			// Dropzone
			//
			var view = this,
				sharer = view.$el.find('.sharer');
			sharer.dropzone({
				url: "post.php",
				uploadMultiple: false,
				acceptedFiles: "image/jpeg",
				sending: function () {
					sharer.addClass('load');
				},
				success: function (data, p) {
					//workshop.waiting('stop');
					var json = p.success ? p : JSON.parse(p);
					Backbone.history.navigate('paper/' + json.id, {trigger: true});
					sharer.removeClass('load');
				}
			});
		}
	});
});