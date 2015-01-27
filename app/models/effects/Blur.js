// baliseimage
// 2015
// Blur Backbone Model
//
define(['app/models/EffectModel','StackBlur'], function (EffectModel) {
	return function(){return new EffectModel({
		type:'blur',
		render:function(imageModel,context,next){
			console.log('apply blur '+imageModel.get('blur-radius'));
			stackBlurCanvasRGB('canvas', 0, 0, context.canvas.width, context.canvas.height, imageModel.get('blur-radius'));
			return next();
		}
	})}
});