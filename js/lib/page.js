define(['rsvp', 'lib/templater'], function(RSVP, Templater) {

	function Page(pagename, pageData) {

		this.pagename = pagename;
		this.pageData = pageData;

		return this.initialize();
	}

	Page.prototype = {

		initialize: function() {

			return new RSVP.Promise(function(resolve, reject) {

				this.getTemplate().then(function($element) {

					this.$el = $element;

					this.append();

					resolve(this);
				}.bind(this));
			}.bind(this));
		},

		getTemplate: function() {

			return new Templater('pages/' + this.pagename, {});
		},

		append: function() {

			this.$el.appendTo('body');

			this.show();
		},

		show: function() {

			$('.page').hide();

			this.$el.show();
		}
	}

	return Page;
});