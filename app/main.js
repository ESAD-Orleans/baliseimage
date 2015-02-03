define(['jquery','backbone','underscore','settings', 'app/router', 'app/models/ImageModel', 'app/views/WorkshopView'], function($,Backbone,_, settings, router, ImageModel, WorkshopView){

	var imageModel,
		workshop;

	//
	// routes
	//
	router.on('route',Route);

	//
	// Backbone History setup
	//
	Backbone.history.start({
		root: settings.get('BASE_URL'),
		pushState: true
	});
	router.navigate(Backbone.history.fragment, {trigger: true});


	function Route(r,o){
		console.log(r,o)
		// page validation
		switch(r){
			case 'home':
				if(workshop){
					workshop.remove();
					workshop = null;
				}
				break;
			case 'share' :
				if(!o[0]){
					break;
				}
			case 'editPaper':
			case 'newPaper':
				// setup new workshop
				if(!workshop){
					var imageModel = new ImageModel();
					workshop = new WorkshopView(imageModel,r);
				}
				break;
		}
		// page option
		switch(r){
			case 'share' :
				if(! workshop){router.navigate('',{trigger:true}); break;}
				workshop.sharePaper(o[0]);
				break;
			case 'editPaper':
				workshop.editPaper(o[0]);
				break;
			case 'newPaper':
				workshop.newPaper();
				break;
		}
	}

})
