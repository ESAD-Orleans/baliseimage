define(['jquery','backbone','underscore',
		'app/models/ImageModel',
		'app/models/EffectCollection',
	'glitch-canvas', 'interact','StackBlur','dropzone'],
	function($,Backbone,_,
             ImageModel,
             EffectCollection,
             glitch,
             interact
		){

	var BASE_URL = $('base').attr('href'),
		FILE_URL = BASE_URL+"files/";

	var image = new Image(),
		imageModel = new ImageModel(),
		effectCollection = new EffectCollection();

	var router = new Backbone.Router({
		routes:{
			'paper/:id':'editPaper'
		}
		});

	var workshop,
		paper,
		$canvas, canvas,
		context;
	//
	var Workshop = Backbone.View.extend({
		el:'#workshop',
		events:{
			'change [type=range]':'updateFormValues',
			'click #sharer':'share'
		},
		initialize:function(){

			// pattern singleton
			workshop = this;
			paper = workshop.$el.find('#paper');


			//
			// routes
			//
			router.on('route:editPaper',this.editPaper);

			$canvas = $('canvas'),
			canvas = $canvas.get(0);

			//
			// Dropzone
			//
			$canvas.dropzone({
				url: "post",
				uploadMultiple: false,
				acceptedFiles: "image/jpeg",
				sending:function(){
					workshop.waiting();
				},
				success: function (data, p) {
					workshop.waiting('stop');
					var json = p.success ? p : JSON.parse(p);
					Backbone.history.navigate('paper/' + json.filename,{trigger:true});
				}
			});

			//
			//
			//
			workshop.$el.find('input').each(function(){
				$(this).data('default-value',$(this).val());
			});

			//
			//
			//


			workshop.$el.find('.draganddropimage').each(function() {

				var image = this, $image = $(this);

				image.style.webkitTransform =
					image.style.transform =
						'translate(' + $image.attr('data-x') + 'px, ' + $image.attr('data-y') + 'px)';
				;
				//
				interact(image).draggable({
					inertia: true,
					onmove:function(event){

						// keep the dragged position in the data-x/data-y attributes
							x = (parseFloat($image.attr('data-x')) || 0) + event.dx,
							y = (parseFloat($image.attr('data-y')) || 0) + event.dy;

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
				overlap: 0.1,

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
					image.data('offset',{
						left: parseInt(image.attr('data-x'))-paper.position().left,
						top: parseInt(image.attr('data-y'))-paper.position().top
					});
					workshop.updateEditor();
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

			//
			// Backbone History setup
			//
			Backbone.history.start({
				root: BASE_URL,
				pushState: true
			});
			router.navigate(Backbone.history.fragment, {trigger: true});

		},
		waiting:function(stop){
			if(stop){
				$('.waiting').remove();
			}else{
				workshop.$el.append($('<div class="waiting"></div>'));
			}
		},
		//
		// start editing an image
		//
		editPaper:function(id){
			image = new Image();
			$(image).on('load',function(){
				workshop.initializeEditor();
			});
			image.src = FILE_URL+id+'.jpg';
		},
		updateFormValues:function(){
			workshop.$el.find('input[type=range]').each(function(){
				var range = $(this);
				imageModel.set(range.attr('id'), range.val());
			});
			workshop.updateEditor();
		},
		updateEditor:function(){

			if(_.isUndefined(context)) return;
			context.drawImage(image, 0, 0);

			stackBlurCanvasRGB('canvas', 0, 0, canvas.width, canvas.height, imageModel.get('blur-radius'));

			workshop.$el.find('.draganddropimage.dropped').each(function () {
				var offset = $(this).data('offset');
				context.drawImage(this, offset.left, offset.top);
			});


			var my_image_data = context.getImageData(0, 0, canvas.clientWidth, canvas.clientHeight);
			var parameters = {
				amount: imageModel.get('glitch-amount'),
				seed: imageModel.get('glitch-seed'),
				iterations: imageModel.get('glitch-iterations'),
				quality: imageModel.get('glitch-quality')
			};

			glitch(my_image_data, parameters, function(image_data){
				context.putImageData(image_data, 0, 0);
			});





		},
		initializeEditor:function(){
			context = canvas.getContext('2d');
			workshop.updateEditor();
		},
		resetInput:function(){
			workshop.$el.find('input').each(function () {
				$(this).val($(this).data('default-value'));
			});
		},
		share:function(e){
			e.preventDefault();
			var data = canvas.toDataURL('image/jpeg');
			workshop.waiting();
			$.ajax({
				url:'post',
				method:'POST',
				dataType: 'json',
				data:{imageData:data},
				success:function(r){
					var json = r;
					workshop.waiting('stop');
					workshop.resetInput();
					Backbone.history.navigate('paper/' + r.filename, {trigger: true});
					workshop.updateFormValues();
					window.prompt("partager cette url", window.location.href);
				}
			})
		}
	});

	new Workshop();



})
