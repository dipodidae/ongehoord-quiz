'use strict';
 
module.exports = function (grunt) {

	// load all grunt tasks
	grunt.loadNpmTasks('grunt-contrib-less');

	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.initConfig({
		watch: {
			// if any .less file changes in directory "public/css/" run the "less"-task.
			files: ["assets/styles/*.less", "assets/styles/**/*.less"],
			tasks: ["less"]
		},

		// "less"-task configuration
		less: {
			// production config is also available
			options: {
				'compress': true,
				plugins: [
					new (require('less-plugin-autoprefix'))({
						browsers: [
							"last 2 versions"
						]
					}),
					require('less-plugin-glob')
				]
			},
			development: {
				options: {
					// Specifies directories to scan for @import directives when parsing. 
					// Default value is the directory of the source, which is probably what you want.
					paths: ["assets/styles/"],
				},
				files: {
					// compilation.css  :  source.less
					"dist/css/app.css": "assets/styles/main.less"
				}
			},
		},
	});
	 // the default task (running "grunt" in console) is "watch"
	 grunt.registerTask('default', ['less']);
};