/**
 * Application
 */
define(['lib/page', 'quiz'], function(Page, Quiz) {

	function Application() {

		new Page('index').then(this.init.bind(this));
	}

	Application.prototype = {

		/**
		 * Supported button colors and corresponding event codes
		 * @type {Array}
		 */
		physicalButtons: [
			{
				'color': 'green',
				'eventcode': 49
			},
			{
				'color': 'yellow',
				'eventcode': 50
			},
			{
				'color': 'purple',
				'eventcode': 49
			},
		],

		/**
		 * Initializes the Application object
		 * 
		 * @param  {Page}		Page object
		 * @return {undefined}
		 */
		init: function(Page) {

			this.page = Page;

			this.bindEvents();
		},

		/**
		 * Binds the Application events
		 * 
		 * @return {undefined}
		 */
		bindEvents: function() {

			$(document).keyup(this.findButtonState.bind(this));
		},

		/**
		 * Runs when a key is pressed
		 * Checks if the key is in the physical key list
		 * 
		 * @param  {jQuery.event}
		 * @return {undefined}
		 */
		findButtonState: function(event) {

			console.log('button state', event.which);

			$.each(this.physicalButtons, function(key, buttonData) {

				if (event.which === buttonData.eventcode) {
					this.triggerButton(buttonData.color);

					/**
					 * Start the quiz if the user is in this screen only
					 * and presses the green button
					 */
					if (this.page.$el.is(':visible') && buttonData.color == 'green') {
						this.startQuiz();
					}
				}
			
			}.bind(this));
		},

		/**
		 * Triggers a button with the corresponding color class if the
		 * physical button is triggered
		 *
		 * @param  {string}		button color
		 * @return {undefined}
		 */
		triggerButton: function(color) {

			$('.button.'+ color +':visible').trigger('click');
		},

		/**
		 * Starts the quiz
		 *
		 * @return {undefined}
		 */
		startQuiz: function() {

			console.log('start quiz!');

			var quiz = new Quiz();
		}
	}

	return Application;

});