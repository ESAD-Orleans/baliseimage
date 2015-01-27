// baliseimage
// 2015
// settings Backbone Model
//
define(['underscore', 'jquery', 'backbone'], function (_, $, Backbone) {
	var Settings = Backbone.Model.extend({
		initialize:function(){
			this.set('BASE_URL', $('base').attr('href'));
			this.set('FILE_URL', this.get('BASE_URL') + "files/");
		}
	});
	return new Settings();
});