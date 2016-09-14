define(['lib/questions', 'lib/templater', 'bower/video.js/dist/video'], function(Questions, Templater, videojs) {

	function Quiz(application) {

		var Page = new require('lib/page');

		this.application = application || {};

		new Page('quiz').then(this.init.bind(this));
	}

	Quiz.prototype = {
			
		questions: [],

		elements: {
			'quiz': $('#quiz'),
			'question': $('#quiz-question'),
			'answers': $('#quiz-answers')
		},

		status: {
			unanswered: 0,
			right: 0,
			wrong: 0,
		},

		currentQuestion: 0,

		score: 0,

		init: function(Page) {

			this.page = Page;

			this.setQuestions();

			this.loadQuestion(this.getCurrentQuestion());
		},

		setQuestions: function(questions) {

			this.status.unanswered = Questions.length;
		},

		show: function() {

			$('.element-main').hide();

			this.elements.quiz.show();
		},

		loadQuestion: function(questionData) {

			this.getQuizContainer().empty();

			$.each(questionData.answers, function(key, answer) {
				
				var button = this.application.physicalButtons.filter(function(buttonData) {
			
					return buttonData.quizAnswer == answer.key;
				});

				answer.color = (button.length ? button.pop().color : false);
			}.bind(this));

			return new Templater('elements/question', questionData)
				.then(function($element) {

					var $buttons;

					$element.appendTo(this.getQuizContainer())
					
					$buttons = $element.find('button');

					$buttons.each(function(key, button) {

						var $button = $(button);

						$button.bind(
							'click',
							{
								'key': $button.data('key')
							},
							this.answerClick.bind(this)
						);
					}.bind(this));
				}.bind(this));
		},

		getQuizContainer: function() {
			return this.page.$el.find('#application-quiz-content');
		},

		answerClick: function(event) {

			var currentQuestion = this.getCurrentQuestion(),
				right = event.data.key == currentQuestion.correct;

			this.updateStatus(right);
			this.loadFeedback(right)
		},

		updateStatus: function(right) {

			this.status.unanswered--;
			this.status[right ? 'right' : 'wrong']++;
		},

		getCurrentQuestion: function() {

			return Questions[this.currentQuestion];
		},

		loadFeedback: function(right) {

			var currentQuestion = this.getCurrentQuestion();

			return new Templater('elements/feedback', {
				title: right ? 'Goedzo' : 'Fout',
				text: currentQuestion.feedback
			}).then(function($element) {

				this.getQuizContainer().empty();
				$element.appendTo(this.getQuizContainer());
				var last = (this.currentQuestion + 1) == Questions.length;
			}.bind(this));
		},

		last: function() {

			console.log('last');
		},

		next: function() {

			this.currentQuestion++;

			this.loadCurrentQuestion();

		}
	}

	return Quiz;
});