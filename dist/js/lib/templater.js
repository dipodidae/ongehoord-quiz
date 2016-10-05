define(['bower/handlebars/handlebars.min', 'rsvp'], function(Handlebars, RSVP) {

	function Templater(filename, data) {

		if (!filename) {
			return this;
		}

		this.filename = filename;

		if (data) {
			this.data = data;
		}

		return this.initialize();
	}

	Templater.prototype = {

		data: {},

		source: null,

		template: null,

		html: null,

		$el: null,

		initialize: function() {

			return this.getSource().then(this.setElement.bind(this));
		},

		getSource: function() {

			var path = 'text!templates/' + this.filename + '.html';

			return new RSVP.Promise(function(resolve, reject) {

				require([path], function(source) {
						
					if (source) {
						resolve(source);
					} else {
						reject(error);
					}
				});
			});
		},

		setElement: function(source) {

			this.source = source;

			return new RSVP.Promise(function(resolve, reject) {

				this.create();
				resolve(this.$el);
			}.bind(this));
		},

		create: function() {

			this.template = this.compile();
			this.html = this.getHTML();
			this.$el = $(this.html);

			return this;
		},

		getHTML: function() {

			return this.template(this.data);
		},

		compile: function() {

			return Handlebars.compile(this.source);
		},

		insert: function() {

			this.$el.appendTo('body');

			return this;
		},

		getElement: function() {

			return this.$el;
		}
	}

	return Templater;
});