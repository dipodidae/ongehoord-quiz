// Place third party dependencies in the lib folder
//
// Configure loading modules from the lib directory,
// except 'app' ones, 
requirejs.config({
	"baseUrl": "js/app",
	"paths": {
		"lib": "../lib",
		"bower": "../../bower_components",
		"jquery": "../../bower_components/jquery/dist/jquery.min"
	}
});

// Load the main app module to start the app
requirejs(["main"]);
