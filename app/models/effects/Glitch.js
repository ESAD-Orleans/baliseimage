// baliseimage
// 2015
// Blur Backbone Model
//
define(['app/models/EffectModel', 'glitch-canvas'], function (EffectModel,glitch) {
	return function(){return new EffectModel({
		type:'glitch',
		render:function(imageModel,context,next){
			//
			var my_image_data = context.getImageData(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
			var parameters = {
				amount: imageModel.get('glitch-amount'),
				seed: imageModel.get('glitch-seed'),
				iterations: imageModel.get('glitch-iterations'),
				quality: imageModel.get('glitch-quality')
			};
			if(parameters.seed == 0 && parameters.amount > 0){
				parameters.seed = 1;
			}
				console.log('apply glitch', parameters)
			glitch(my_image_data, parameters, function (image_data) {
				context.putImageData(image_data, 0, 0);
				console.log('glitch apply successfull !');
				next();
			});
		}
	})}
});