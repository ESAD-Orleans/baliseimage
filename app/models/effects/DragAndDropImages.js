// baliseimage
// 2015
// Blur Backbone Model
//
define(['jquery','app/models/EffectModel','StackBlur'], function ($,EffectModel) {
	return function(){return new EffectModel({
		type:'dragAndDropImages',
		render:function(imageModel,context,next){
			imageModel.get('dragAndDropImages')
			.each(function(image){
					var offset = $(image).data('offset');
					console.log('draw image '+image.id+' [%s,%s]',offset.left,offset.top)
					context.drawImage(image, offset.left, offset.top);
			})
			return next();
		}
	})}
});