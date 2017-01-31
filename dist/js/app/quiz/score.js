define(['lib/templater', 'data/questions', 'data/quizfeedback'], function(Templater, Questions, Feedback) {

	function Score(quiz) {

		this.quiz = quiz || {};

		this.init();

	}

	Score.prototype = {

		quiz: {},

		/**
		 * Initialize
		 *
		 * @return {[type]} [description]
		 */
		init: function() {

			this.load();
		},

		/**
		 * Loads the feedback after a question has been
		 * answered
		 *
		 * @param  {[type]} right [description]
		 * @return {[type]}       [description]
		 */
		load: function() {

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

			var templateData = $.extend(this.quiz.status, {
				'score': this.getScore(),
				'feedback': this.getFeedback()
			});

			return new Templater('elements/last', templateData);
		},

		/**
		 * [injectFeedback description]
		 *
		 * @param  {[type]} $element [description]
		 * @return {[type]}          [description]
		 */
		inject: function($element) {

			this.quiz.getContainer().html($element);

			$element.bind('click', this.quiz.quit.bind(this.quiz));
		},

		getScore: function() {

			return Math.round((this.quiz.status.right / Questions.length) * 100);
		},

		getFeedback: function() {

			var feedback = 'default.feedback',
				score = this.getScore();

			$.each(Feedback, function(key, QuizFeedbackScore) {

				if (QuizFeedbackScore.withinPercentage <= score) {
					feedback = QuizFeedbackScore.feedback;
				}
			});

			return feedback;
		},

	};

	return Score;
});