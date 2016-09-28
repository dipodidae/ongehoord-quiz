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

					this.$el.addClass('page');

					this.append();

					resolve(this);
				}.bind(this));
			}.bind(this));
		},

		getTemplate: function() {

			return new Templater('pages/' + this.pagename, {});
		},

		append: function() {

			$('#page-container').html(this.$el);

			this.show();
		},

		show: function() {

			$('.page').hide();

			this.$el.show();
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