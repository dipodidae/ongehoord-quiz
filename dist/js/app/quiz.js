define([
	'data/questions',
	'data/quizfeedback',
	'lib/templater',
	'bower/video.js/dist/video',
	'bower/chartist/dist/chartist'
], function(
		Questions,
		QuizFeedback,
		Templater,
		videojs) {

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
			
			this.loadQuestion(this.getCurrentQuestion());

			this.initChart();

		},

		/**
		 * Initialize the chart display
		 *
		 * @return {[type]} [description]
		 */
		initChart: function() {

			var data = this.getChartData(),
				options  = {
					labelInterpolationFnc: function(value) {
						return value[0]
					},
					// donut: true,
					// donutWidth: 60,
					// startAngle: 270,
					// total: 200,
				},
				responsiveOptions = [
					['screen and (min-width: 640px)', {
						chartPadding: 30,
						labelOffset: 100,
						labelDirection: 'explode',
						labelInterpolationFnc: function(value) {
							return value;
						}
					}],
					['screen and (min-width: 1024px)', {
						labelOffset: 80,
						chartPadding: 20
					}]
				];

			this.chart = new Chartist.Pie(
				'#application-quiz-chart',
				data,
				options,
				responsiveOptions
			);
		},

		/**
		 * Updates the chart display
		 *
		 * @return {[type]} [description]
		 */
		updateChart: function() {

			this.chart.update(this.getChartData());
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
		 * Loads a question from a given questionDataSet
		 *
		 * @param  {[type]} questionData [description]
		 * @return {[type]}              [description]
		 */
		loadQuestion: function(questionData) {

			this.getQuizContainer().empty();

			return new Templater('elements/question', questionData)
						.then(this.injectQuestion.bind(this));
		},

		injectQuestion: function($element) {

			var $buttons;

			this.getQuizContainer()

			$buttons = $element.find('button');
			
			$buttons.each(function(key, button) {

				var $button = $(button);

				$button.bind('click', {
					'key': $button.data('key')
				}, this.answerClick.bind(this));
			}.bind(this));
		},

		/**
		 * Returns the current Quiz container DOM element
		 *
		 * @return {[type]} [description]
		 */
		getQuizContainer: function() {

			return $('#application-quiz-content');
		},

		/**
		 * Button click callback
		 *
		 * @param  {[type]} event [description]
		 * @return {[type]}       [description]
		 */
		answerClick: function(event) {

			var currentQuestion = this.getCurrentQuestion(),
				right = event.data.key == currentQuestion.correct;

			this.updateStatus(right);
			this.loadFeedback(right)
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

			this.updateChart();
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
		 * Loads the feedback after a question has been
		 * answered
		 *
		 * @param  {[type]} right [description]
		 * @return {[type]}       [description]
		 */
		loadFeedback: function(right) {

			var currentQuestion = this.getCurrentQuestion();

			return new Templater('elements/feedback', {
				'title':					right ? 'Goedzo' : 'Fout',
				'text':						currentQuestion.feedback,
				'currentQuestionNumber':	currentQuestion.questionNumber,
				'video':					this.getVideoUrl(),
			}).then(this.injectFeedback.bind(this));
		},

		/**
		 * [injectFeedback description]
		 *
		 * @param  {[type]} $element [description]
		 * @return {[type]}          [description]
		 */
		injectFeedback: function($element) {

			this.getQuizContainer().html($element);

			$element.bind('click', {}, this.nextPage.bind(this));
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
		 * Goes to the last page
		 *
		 * @return {[type]} [description]
		 */
		last: function() {

			var score = Math.round((this.status.right / Questions.length) * 100);

			return new Templater('elements/last', $.extend(this.status, {
				'score': score,
				'feedback': this.getQuizFeedback(score)
			})).then(function($element) {

				this.getQuizContainer()
					.html($element);

				$element.bind('click', {}, this.quit.bind(this));
			}.bind(this));

		},

		getQuizFeedback: function(score) {

			var feedback = 'default.feedback';

			$.each(QuizFeedback, function(key, QuizFeedbackScore) {
				
				if (QuizFeedbackScore.withinPercentage <= score) {
					feedback = QuizFeedbackScore.feedback;
				}
			});

			return feedback;
		},

		/**
		 * Goes to the next question
		 *
		 * @return {Function} [description]
		 */
		next: function() {

			this.currentQuestion++;

			this.loadQuestion(this.getCurrentQuestion());

		},

		/**
		 * Quits the Quiz
		 *
		 * @return {[type]} [description]
		 */
		quit: function() {

			this.application.removeQuiz();
		},

		/**
		 * Returns the URL of the video
		 *
		 * @return {string} VideoURL
		 */
		getVideoUrl: function(videoName) {

			var url = 'dist/movies/' + (videoName || this.currentQuestion) + '.webm';

			return url;
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