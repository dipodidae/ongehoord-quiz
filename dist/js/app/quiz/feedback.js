define(['lib/templater'], function(Templater) {

	function Feedback(quiz, right) {

		this.quiz = quiz || {};

		this.right = right || false;

		this.init();

	}

	Feedback.prototype = {

		quiz: {},

		right: null,

		/**
		 * Initialize
		 *
		 * @return {[type]} [description]
		 */
		init: function() {

			this.setData(this.quiz.getCurrentQuestion());
			this.load();
		},

		/**
		 * [setData description]
		 *
		 * @param {[type]} data [description]
		 */
		setData: function(data) {

			this.data = data || {};
		},

		getData: function() {

			return this.data;
		},

		/**
		 * Loads the feedback after a question has been
		 * answered
		 *
		 * @param  {[type]} right [description]
		 * @return {[type]}       [description]
		 */
		load: function(right) {

			this.getTemplate()
				.then(this.inject.bind(this))
				.catch(function(error) {

					console.error(error);
				});
		},

		/**
		 * Calls template object
		 *
		 * @todo place right switch in template instead of in the logic
		 * @return {RSVP.Promise}
		 */
		getTemplate: function() {

			var question = this.quiz.getCurrentQuestion();

			return new Templater('elements/feedback', {
				'title':					this.right ? 'Goedzo' : 'Fout',
				'text':						question.feedback,
				'currentQuestionNumber':	question.questionNumber,
				'video':					this.getVideoUrl(),
			})
		},

		/**
		 * [injectFeedback description]
		 *
		 * @param  {[type]} $element [description]
		 * @return {[type]}          [description]
		 */
		inject: function($element) {

			this.quiz.getContainer().html($element);

			$element.bind('click', {}, this.quiz.nextPage.bind(this.quiz));
		},

		/**
		 * Returns the URL of the video
		 *
		 * @return {string} VideoURL
		 */
		getVideoUrl: function(videoName) {

			var url = 'dist/movies/' + (videoName || this.quiz.currentQuestion) + '.mp4';

			return url;
		}
	};

	return Feedback;
});