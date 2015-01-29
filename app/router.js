define(['backbone'],function(Backbone){
	var Router = Backbone.Router.extend({
		routes: {
			'paper':'newPaper',
			'paper/':'newPaper',
			'paper/:id': 'editPaper',
			'*path': 'redirect'
		},
		redirect:function(r){
			console.log('unknow route %s',r);
			this.navigate('paper',{trigger:true});
		}
	});
	return new Router();
})