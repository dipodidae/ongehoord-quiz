define([
	'data/questions',
	'bower/video.js/dist/video',
	'quiz/chart',
	'quiz/question',
	'quiz/score',
], function(
		Questions,
		videojs,
		QuizChart,
		QuizQuestion,
		QuizScore) {

	function Quiz(application) {

		var Page = require('lib/page');

		this.application = application || {};

		new Page('quiz').then(this.init.bind(this));
	}

	Quiz.prototype = {
			
		questions: [],

		elements: {
			'quiz': $('#quiz'),
			'question': $('#quiz-question'),
			'answers': $('#quiz-answers'),
			'quizContent': false
		},

		status: {
			unanswered: 0,
			right: 0,
			wrong: 0,
			total: 0,
		},

		currentQuestion: 0,

		score: 0,

		/**
		 * Constructor
		 *
		 * @param  {[type]} Page [description]
		 * @return {[type]}      [description]
		 */
		init: function(Page) {

			this.page = Page;

			this.setQuestions();

			this.chart = new QuizChart(this.getChartData());

			this.question = new QuizQuestion(this);
			
			this.loadQuestion(this.getCurrentQuestion());

		},

		/**
		 * Gets the chart data to be used
		 * in the chart display
		 *
		 * @return {[type]} [description]
		 */
		getChartData: function() {

			return {
				labels: ['Nog niet beantwoord', 'Goeie antwoorden', 'Foute antwoorden'],
				series: [this.status.unanswered, this.status.right, this.status.wrong]
			};
		},

		/**
		 * Sets the question data
		 *
		 * @param {[type]} questions [description]
		 */
		setQuestions: function(questions) {

			this.matchButtons();

			this.status.total = Questions.length;
			this.status.unanswered = Questions.length;
		},

		/**
		 * Matches the pressed button against the
		 * buttons from the physical buttonset
		 *
		 * @return {[type]} [description]
		 */
		matchButtons: function() {

			$.each(Questions, function(key, questionData) {

				$.each(questionData.answers, function(key, answer) {
				
					var button = this.application.physicalButtons.filter(function(buttonData) {
				
						return buttonData.quizAnswer == answer.key;
					});

					answer.color = (button.length ? button.pop().color : false);
				}.bind(this));
			}.bind(this));
		},

		/**
		 * Shows the Quiz
		 *
		 * @return {[type]} [description]
		 */
		show: function() {

			$('.element-main').hide();

			this.elements.quiz.show();
		},

		/**
		 * Returns the current Quiz container DOM element
		 *
		 * @return {[type]} [description]
		 */
		getContainer: function() {

			return $('#application-quiz-content');
		},

		/**
		 * Updates the Quiz status
		 *
		 * @param  {[type]} right [description]
		 * @return {[type]}       [description]
		 */
		updateStatus: function(right) {

			this.status.unanswered--;
			this.status[right ? 'right' : 'wrong']++;

			if (this.chart) {
				
				this.chart.setData(this.getChartData());
			}
		},

		/**
		 * Returns the current question
		 *
		 * @return {[type]} [description]
		 */
		getCurrentQuestion: function() {

			var currentQuestion = Questions[this.currentQuestion];

			return $.extend(currentQuestion, {
				'questionNumber': this.currentQuestion
			});
		},


		/**
		 * Decides what the next pages is
		 * and goes to it
		 *
		 * @return {[type]} [description]
		 */
		nextPage: function() {

			var last = (this.currentQuestion + 1) == Questions.length;

			return last
					? this.last()
					: this.next();
		},

		/**
		 * Goes to the next question
		 *
		 * @return {Function} [description]
		 */
		next: function() {

			this.currentQuestion++;

			this.question = new QuizQuestion(this);

		},

		/**
		 * Load the score page
		 * @return {[type]} [description]
		 */
		last: function() {

			return new QuizScore(this);
		},

		/**
		 * Quits the Quiz
		 *
		 * @return {[type]} [description]
		 */
		quit: function() {

			this.application.removeQuiz();
		},

		destroy: function() {

			//reset status ??
			$.each(this.status, function(key, val) {

				this.status[key] = 0;
			}.bind(this));
		},
	};

	return Quiz;
});