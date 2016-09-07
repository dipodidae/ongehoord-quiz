define(["jquery", "application", 'bower/handlebars/handlebars.min'], function($, Application, Handlebars) {

	var app;

	Handlebars.registerHelper('each', function(context, options) {
	
		var ret = "";

		for (var i=0, j=context.length; i<j; i++) {
			ret = ret + options.fn(context[i]);
		}

		return ret;
	});

	$(function() {
	
		app = new Application();
	});
});