/**
 * Application
 */
define(['lib/page', 'data/buttons', 'quiz'], function(Page, Buttons, Quiz) {

	function Application() {

		new Page('index').then(this.init.bind(this));
	}

	Application.prototype = {

		keyCache: [],

		/**
		 * Initializes the Application object
		 * 
		 * @param  {Page}		Page object
		 * @return {undefined}
		 */
		init: function(Page) {

			this.physicalButtons = Buttons;

			this.page = Page;

			this.bindEvents();
		},

		/**
		 * Binds the Application events
		 * 
		 * @return {undefined}
		 */
		bindEvents: function() {

			$(document).keyup(this.keyUp.bind(this));
			$(document).keydown(this.keyDown.bind(this));
			this.page.$el.bind('click', this.startQuiz.bind(this));
		},

		/**
		 * Runs when a key is pressed
		 * Checks if the key is in the physical key list
		 * 
		 * @param  {jQuery.event}
		 * @return {undefined}
		 */
		keyUp: function(event) {

			var buttonData = this.getButtonColorByEventcode(event.which);

			/**
			 * Remove the current button from the keycache
			 */
			var keyCacheIndex = this.keyCache.indexOf(event.which);

			if (keyCacheIndex > -1) {
				this.keyCache.splice(keyCacheIndex, 1);
			}

			if (!buttonData || this.keyPause) {
				return;
			}

			this.triggerAnyElement();

			this.triggerButton(buttonData.color);		
		},

		keyDown: function() {

			var removeQuiz = true;

			this.keyCache.push(event.which);

			/**
			 * If all buttons are pressed, quit the quiz
			 */
			$.each(this.physicalButtons, function(key, buttonData) {

				if (this.keyCache.indexOf(buttonData.eventcode) == -1) {
					removeQuiz = false;
				}
			}.bind(this));

			if (this.quiz && removeQuiz) {

				this.quiz.page.remove();
				delete this.quiz;
				this.page.show();
				
				this.setKeyPause();
			}
		},

		triggerAnyElement: function() {

			$('.interactive.any:visible').trigger('click');
		},

		setKeyPause: function() {

			this.keyPause = true;

			setTimeout(function(){

				this.keyPause = false;
				delete this.keyPause;
			}.bind(this), 3000);
		},

		/**
		 * Compares the pressed button with the set button colors
		 * If the button is in the set, return the color
		 *
		 * @param  {Int}			eventcode
		 * @return {false|string}	the Buttoncolor
		 */
		getButtonColorByEventcode: function(eventcode) {

			return this.getButtonByFilter('eventcode', eventcode);
		},

		/**
		 * Gets button by filter
		 *
		 * @param  {[type]} filtername  [description]
		 * @param  {[type]} filtervalue [description]
		 * @return {[type]}             [description]
		 */
		getButtonByFilter: function(filtername, filtervalue) {

			var find = this.physicalButtons.filter(function(buttonData) {
			
				return buttonData[filtername] == filtervalue;
			});

			return find.length ? find.pop() : false;
		},

		/**
		 * Triggers a button with the corresponding color class if the
		 * physical button is triggered
		 *
		 * @param  {string}		button color
		 * @return {jQuery.object}
		 */
		triggerButton: function(color) {

			return $('.interactive.' + color + ':visible').trigger('click');
		},

		/**
		 * Starts the quiz
		 *
		 * @return {undefined}
		 */
		startQuiz: function() {

			console.log('start quiz!');

			this.quiz = new Quiz(this);
		}
	}

	return Application;

});