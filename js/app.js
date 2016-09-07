// Place third party dependencies in the lib folder
//
// Configure loading modules from the lib directory,
// except 'app' ones, 
requirejs.config({
	"baseUrl": "js/app",
	"paths": {
		"text": "../../bower_components/requirejs-text/text",
		"rsvp": "../../bower_components/rsvp.js/rsvp.min",
		"jquery": "../../bower_components/jquery/dist/jquery.min",
		"lib": "../lib",
		"bower": "../../bower_components",
		"templates": "../../templates"
	}
});

// Load the main app module to start the app
requirejs(["main"]);
