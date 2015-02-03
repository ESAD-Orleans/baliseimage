define(['jquery','backbone','underscore','settings', 'app/router', 'app/models/ImageModel', 'app/views/WorkshopView', 'app/views/GalleryView', 'app/views/AdminView'], function($,Backbone,_, settings, router, ImageModel, WorkshopView, GalleryView, AdminView){

	var imageModel,
		currentPage;

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

	function DisplayPage(viewType){
		if(currentPage){
			if(currentPage.type == viewType){ return; }
			currentPage.remove();
			$('body').append($('<div id="site"></div>'))
		}
		switch(viewType) {
			case 'admin' :
				currentPage = new AdminView();
				break;
			case 'workshop' :
				imageModel = new ImageModel();
				currentPage = new WorkshopView(imageModel);
				break;
			case 'gallery' :
				currentPage = new GalleryView();
				break;
		}
		currentPage.$el.addClass('page-'+viewType);
	}

	function Route(r,o){
		//console.log(r,o)
		// page validation
		switch(r){
			case 'admin':
				DisplayPage('admin');
				break;
			case 'gallery':
				DisplayPage('gallery');
				break;
			case 'share' :
				if(!o[0]){
					break;
				}
			case 'editPaper':
			case 'newPaper':
				// setup new workshop
				DisplayPage('workshop');

				break;
		}
		// page option
		switch(r){
			case 'share' :
				if(!currentPage){router.navigate('',{trigger:true}); break;}
				currentPage.sharePaper(o[0]);
				break;
			case 'editPaper':
				currentPage.editPaper(o[0]);
				break;
			case 'newPaper':
				currentPage.newPaper();
				break;
			case 'gallery':
				break;
		}
	}

})
