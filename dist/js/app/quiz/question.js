define(['lib/templater', 'quiz/feedback'], function(Templater, QuizFeedback) {

	function Question(quiz) {

		this.quiz = quiz || {};

		this.init();

	}

	Question.prototype = {

		init: function() {

			this.setData(this.quiz.getCurrentQuestion());
			this.load();
		},

		setData: function(data) {

			this.data = data || {};
		},

		getData: function() {

			return this.data;
		},

		load: function() {

			this.quiz.getContainer().empty();

			this.getTemplate()
				.then(this.inject.bind(this))
				.catch(function(error) {

					console.error(error);
				});
		},

		getTemplate: function() {

			return new Templater('elements/question', this.getData())
		},

		inject: function($element) {

			var $buttons;

			this.quiz.getContainer().html($element);

			$buttons = $element.find('button');

			$buttons.each(function(key, button) {

				var $button = $(button);

				$button.bind('click', {
					'key': $button.data('key')
				}, this.answer.bind(this));
			}.bind(this));
		},

		/**
		 * Button click callback
		 *
		 * @param  {[type]} event [description]
		 * @return {[type]}       [description]
		 */
		answer: function(event) {

			var currentQuestion = this.getData(),
				right = event.data.key == currentQuestion.correct;

			this.quiz.updateStatus(right);

			this.feedback = new QuizFeedback(this.quiz, right);
		},
	};

	return Question;
});