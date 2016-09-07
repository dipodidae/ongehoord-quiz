define(['lib/questions', 'lib/templater', 'bower/video.js/dist/video'], function(Questions, Templater, videojs) {

	function Quiz(application) {

		var Page = new require('lib/page');

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

			return new Templater('elements/question', questionData)
				.then(function($element) {

					$element
						.appendTo(this.page.$el)
						.find('button')
						.bind('click', this.answerClick.bind(this))
				}.bind(this));
		},

		answerClick: function(event) {

			debugger;
		},

		updateStatus: function(right) {

			this.status.unanswered--;
			this.status[right ? 'right' : 'wrong']++;

		},

		getCurrentQuestion: function() {

			return Questions[this.currentQuestion];
		},

		loadFeedback: function(right) {

			return new Templater('elements/feedback', {
				'text': 'Test',
				'title': 'Test',
				'video': '/video/01.webm'
			}).then(function($element) {

				$element
					.appendTo(this.page.$el)
					.find('button')
					.bind('click', function(event) {

						var last = (this.currentQuestion + 1) == Questions.length;

						if (last) {
							this.last();
						} else {
							this.next();
						}

					}.bind(this));
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