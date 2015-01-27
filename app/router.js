define(['backbone'],function(Backbone){
	var Router = Backbone.Router.extend({
		routes: {
			'paper':'newPaper',
			'paper/:id': 'editPaper'
		}
	});
	return new Router();
})