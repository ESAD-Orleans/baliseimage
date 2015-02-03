// baliseimage
// 2015
// WorkshopView Backbone View
//
define(['underscore', 'jquery', 'backbone', 'text!templates/workshop.html','settings', 'app/router', 'app/views/UploadView','app/views/ShareFormView','interact'], function (_, $, Backbone, template,settings, router, UploadView, ShareFormView, interact) {

	var workshop,
		paper,
		$canvas, canvas,
		context;

	return Backbone.View.extend({
		el:'#site',
		events: {
			'change [type=range]': 'updateFormValues',
			'click #sharer': 'share',
			'click h1':'backhome'
		},
		type:'workshop',
		initialize: function (imageModel) {
			this.imageModel = imageModel;
			workshop = this;
			$(window).on('resize', workshop.resize);
			this.render();
			this.imageModel.on('load:image', workshop.initializeEditor, this);
		},
		render:function(){
			this.$el.html(_.template(template)());

			// pattern singleton
			paper = workshop.$el.find('#paper');

			workshop.resize();

			$canvas = workshop.$el.find('#canvas'),
				canvas = $canvas.get(0);

			//
			//
			//
			workshop.$el.find('input').each(function () {
				$(this).data('default-value', $(this).val());
			});

			//
			//
			//


			workshop.$el.find('.draganddropimage').each(function () {

				var image = this, $image = $(this);

				image.style.webkitTransform =
					image.style.transform =
						'translate(' + $image.attr('data-x') + 'px, ' + $image.attr('data-y') + 'px)';
				;
				//
				interact(image).draggable({
					inertia: false,
					onmove: function (event) {

						// keep the dragged position in the data-x/data-y attributes
						x = (parseFloat($image.attr('data-x')) || 0) + event.dx / workshop.scale,
							y = (parseFloat($image.attr('data-y')) || 0) + event.dy / workshop.scale;

						// translate the element
						image.style.webkitTransform =
							image.style.transform =
								'translate(' + x + 'px, ' + y + 'px)';

						// update the posiion attributes
						$image.attr('data-x', x);
						$image.attr('data-y', y);
					}
				});
			});

			interact('#paper').dropzone({
				// only accept elements matching this CSS selector
				accept: '.draganddropimage',
				// Require a 75% element overlap for a drop to be possible
				overlap: 0.75,

				// listen for drop related events:

				ondropactivate: function (event) {
					// add active dropzone feedback
					$(event.relatedTarget).addClass('dragged');
				},
				ondragenter: function (event) {
					$(event.relatedTarget).addClass('can-drop');
				},
				ondragleave: function (event) {
					// remove the drop feedback style
					$(event.relatedTarget).removeClass('can-drop');
				},
				ondrop: function (event) {//
					var image = $(event.relatedTarget);
					image.removeClass('dragged can-drop').addClass('dropped');
					image.data('offset', {
						left: parseInt(image.attr('data-x')) - (workshop.$el.find('#workshop').width() - paper.width()) / 2,
						top: parseInt(image.attr('data-y')) - (workshop.$el.find('#workshop').height() - paper.height()) / 2
					});
					workshop.updateFormValues();
				},
				ondropdeactivate: function (event) {
					// remove active dropzone feedback
					$(event.relatedTarget).removeClass('dragged');
				}
			});

			//
			//
			//
			workshop.updateFormValues();
		},
		backhome:function(){
			workshop.clearContext();
			router.navigate('',{trigger:true});
			return false;
		},
		clearContext:function(){
			context.clearRect(0,0,canvas.width,canvas.height);
		},
		resize:function(){
			if(_.isUndefined(workshop.$el.find('#workshop').parent().get(0))){
				return $(window).off('resize',workshop.resize);
			}
			var el = workshop.$el.find('#workshop').get(0),
				scaleX = $(window).width()/$(el).width(),
				scaleY = $(window).height()/$(el).height(),
				scaleMin = scaleX< scaleY ? scaleX : scaleY;
			workshop.scale = scaleMin>1 ? 1:scaleMin;
			el.style.webkitTransform = el.style.transform =
				'scale('+ workshop.scale +') translate(-640px, -400px)';

		},
		waiting: function (stop) {
			if (stop) {
				$('.waiting').remove();
			} else {
				$('body').append($('<div class="waiting"></div>'));
			}
		},
		//
		// start editing an image
		//
		editPaper: function (id) {
			//
			workshop.imageModel.url = settings.get('FILE_URL')+id+'.json';
			workshop.imageModel.on('sync',this.syncPaper,this);
			workshop.imageModel.fetch();
		},
		syncPaper:function(){
			console.log('sync');
			workshop.$el.find('#workshop').removeClass('new');
		},
		newPaper:function(){
			workshop.$el.find('#workshop').addClass('new');
			new UploadView();
		},
		updateFormValues: function () {
			// update input range values
			workshop.$el.find('input[type=range]').each(function () {
				var range = $(this);
				workshop.imageModel.set(range.attr('id'), range.val());
			});
			// update image drag & drop values
			var dragAndDropImages = _([]);
			workshop.$el.find('.draganddropimage.dropped').each(function () {
				dragAndDropImages.push(this);
			});
			workshop.imageModel.set('dragAndDropImages', dragAndDropImages);
			//
			workshop.updateEditor();
		},
		updateEditor: function () {
			if (_.isUndefined(context)) return;
			workshop.waiting();
			workshop.imageModel.render(context,function(){
				workshop.waiting(true);
			});

		},
		initializeEditor: function () {
			if(canvas){
				context = canvas.getContext('2d');
				workshop.updateEditor();
			}
		},
		resetInput: function () {
			workshop.$el.find('input').each(function () {
				$(this).val($(this).data('default-value'));
			});
		},
		share: function (e) {
			e.preventDefault();
			var data = canvas.toDataURL('image/jpeg');
			workshop.waiting();
			this.imageModel.saveModel(function(r){
				workshop.waiting('stop');
				//workshop.resetInput();
				router.navigate('sharePaper/' + r.id, {trigger: true});
				workshop.updateFormValues();
			},data);
		},
		sharePaper: function(id){
			if(id){
				this.imageModel.set('sharing-id', id);
				this.$el.find('#workshop').addClass('sharing');
				new ShareFormView(this.imageModel);
			}
		}
	});
});