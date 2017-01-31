define(['rsvp', 'lib/templater'], function(RSVP, Templater) {

	function Page(pagename, pageData) {

		this.pagename = pagename;
		this.pageData = pageData;

		return this.initialize();
	}

	Page.prototype = {

		initialize: function() {

			return new RSVP.Promise(function(resolve, reject) {

				this.getTemplate()

				.then(function($element) {

					this.$el = $element;

					this.inject();

					resolve(this);
				}.bind(this))
				.catch(function(error) {

					console.error(error);
				});
			}.bind(this));
		},

		getTemplate: function() {

			return new Templater('pages/' + this.pagename, {});
		},

		inject: function() {

			var $container = $('#page-container');

			$container.attr('class', '');
			$container.addClass('page');
			$container.addClass(this.pagename);

			$container.html(this.$el);

			this.show();
		},

		show: function() {
			//abundant since rewrite
		},

		remove: function() {

			this.$el.remove();
		},

		isVisible: function() {

			return this.$el.is(':visible');
		}
	}

	return Page;
});