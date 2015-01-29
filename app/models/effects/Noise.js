// baliseimage
// 2015
// Blur Backbone Model
//
define(['app/models/EffectModel', 'seedrandom', 'perlin'], function (EffectModel) {
	var PERLIN_SCALE = 10;
	return function(){return new EffectModel({
		type:'noise',
		render:function(imageModel,context,next){
			//
			Math.seedrandom('some noise !!!');
			//
			var w = context.canvas.width,
				h = context.canvas.height,
				pixels = context.getImageData(0,0,w,h),
				CHANNELS = pixels.data.length / (w * h),
				n1 = imageModel.get('noise-n1');
			//
			for(var i=0; i< pixels.data.length; i++){
				var channel = i% CHANNELS,
					pixel = Math.floor(i/ CHANNELS),
					x = Math.floor(pixel%w),
					y = Math.floor(pixel/x);
					;
				if(channel< CHANNELS-1){ //RVB filter
					var c = pixels.data[i],
					c = c*(1-n1/255)+ n1*Math.random();

					c = c<0?0:c>255?255:c;
					pixels.data[i] = c;
				}
			}
			console.log('perlin noise !');
			context.putImageData(pixels,0,0);
			next();
		}
	})}
});