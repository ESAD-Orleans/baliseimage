define(['backbone'],function(Backbone){
	var Router = Backbone.Router.extend({
		routes: {
			'paper':'newPaper',
			'paper/':'newPaper',
			'paper/:id': 'editPaper',
			'sharePaper/:id': 'share',
			'share':'share',
			'gallery':'gallery',
			'*path': 'redirect'
		},
		redirect:function(r){
			console.log('unknow route %s',r);
			this.navigate('paper',{trigger:true});
		},
		share:function(id){
			this.navigate('share', {trigger: true});
		}
	});
	return new Router();
})