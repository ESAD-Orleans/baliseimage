define(['jquery','backbone','underscore','glitch-canvas','dropzone'],function($,Backbone,_,glitch){


	var BASE_URL = $('base').attr('href'),
		FILE_URL = BASE_URL+"files/";

	var image = new Image(),
		imageModel = new Backbone.Model();

	var router = new Backbone.Router({
		routes:{
			'paper/:id':'editPaper'
		}
		});

	var paper,
		$canvas, canvas,
		context;
	//
	var Paper = Backbone.View.extend({
		el:'#paper',
		events:{
			'change [type=range]':'updateFormValues',
			'click #sharer':'share'
		},
		initialize:function(){

			// pattern singleton
			paper = this;


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
					paper.waiting();
				},
				success: function (data, p) {
					paper.waiting('stop');
					var json = p.success ? p : JSON.parse(p);
					Backbone.history.navigate('paper/' + json.filename,{trigger:true});
				}
			});

			//
			//
			//
			paper.$el.find('input').each(function(){
				$(this).data('default-value',$(this).val());
			});

			//
			//
			//
			paper.updateFormValues();

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
				paper.$el.append($('<div class="waiting"></div>'));
			}
		},
		//
		// start editing an image
		//
		editPaper:function(id){
			image = new Image();
			$(image).on('load',function(){
				paper.initializeEditor();
			});
			image.src = FILE_URL+id+'.jpg';
		},
		updateFormValues:function(){
			paper.$el.find('input[type=range]').each(function(){
				var range = $(this);
				imageModel.set(range.attr('id'), range.val());
			});
			paper.updateEditor();
		},
		updateEditor:function(){

			if(_.isUndefined(context)) return;
			context.drawImage(image, 0, 0);

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
			paper.updateEditor();
		},
		resetInput:function(){
			paper.$el.find('input').each(function () {
				$(this).val($(this).data('default-value'));
			});
		},
		share:function(e){
			e.preventDefault();
			var data = canvas.toDataURL('image/jpeg');
			paper.waiting();
			$.ajax({
				url:'post',
				method:'POST',
				dataType: 'json',
				data:{imageData:data},
				success:function(r){
					var json = r;
					paper.waiting('stop');
					paper.resetInput();
					Backbone.history.navigate('paper/' + r.filename, {trigger: true});
					paper.updateFormValues();
					window.prompt("partager cette url", window.location.href);
				}
			})
		}
	});

	new Paper();



})