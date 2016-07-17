function Application() {

	this.init();
}

Application.prototype = {

	buttonColors: [
		'green',
		'red',
		'yellow'
	],

	init: function() {

		$('#welcome').show();

		$('#quiz-start-button').bind('click', function(event) {

			event.preventDefault();

			var quiz = new ongehoordQuiz();
		}.bind(this));

		this.bindEvents();
	},

	bindEvents: function() {

		$(document).keyup(function(event) {
			

			console.log(event.which);

			switch (event.which) {
				case 13:
					//enter
				break;
				case 49:
					//enter
				break;
				case 50:
					//enter
				break;
				case 51:
					//enter
				break;
			}
		});
		// this.triggerButton('green');
	},

	triggerButton: function(color) {

		$('.button.'+ color +':visible').trigger('click');
	}
}

function ongehoordQuiz(application) {

	this.parent = application;
	this.init();
}

ongehoordQuiz.prototype = {
		
	questions: [
		{
			'question': 'Wat doet dit varken?',
			'answers': [
				'niks',
				'heel veel',
				'een heleboel'
			],
			'correct': 1,
			'feedback': 'Omdat daarom!'
		},
		{
			'question': 'Wat doet dit varken? 2',
			'answers': [
				'niks',
				'heel veel',
				'een heleboel'
			],
			'correct': 1,
			'feedback': 'Omdat daarom!'
		},
		{
			'question': 'Wat doet dit varken? 3',
			'answers': [
				'niks',
				'heel veel',
				'een heleboel'
			],
			'correct': 1,
			'feedback': 'Omdat daarom!'
		},
		{
			'question': 'Wat doet dit varken? 4',
			'answers': [
				'niks',
				'heel veel',
				'een heleboel'
			],
			'correct': 1,
			'feedback': 'Omdat daarom!'
		}
	],

	elements: {
		'quiz': $('#quiz'),
		'question': $('#quiz-question'),
		'answers': $('#quiz-answers')
	},

	currentQuestion: 0,

	score: 0,

	init: function() {

		this.loadCurrentQuestion();
	},

	show: function() {

		$('.element-main').hide();

		this.elements.quiz.show();
	},

	loadCurrentQuestion: function() {

		this.show();

		this.elements.question.html(this.getCurrentQuestion().question);

		this.elements.answers.html('');

		$.each(this.getCurrentQuestion().answers, function(key, answer) {

			var $answer = $('<li>'
								+'<a class="button">'
								+'<span class="icon">'
								+'<i class="fa fa-github"></i>'
								+'</span>'
								+'<span>'+ answer +'</span>'
								+'</a>'
								+'<li>')
							.appendTo(this.elements.answers);

			var $button = $answer.find('.button');

			$button.bind('click', function(event) {

				event.preventDefault();

				var right = (key + 1) == this.getCurrentQuestion().correct;

				this.score++;

				this.loadFeedback(right);

			}.bind(this));

		}.bind(this));
	},

	getCurrentQuestion: function() {

		return this.questions[this.currentQuestion];
	},

	loadFeedback: function(right) {

		$('.element-main').hide();
		$('#quiz-feedback').show();

		$('#quiz-feedback')
			.toggleClass('answer-right', right)
			.toggleClass('answer-wrong', !right)
		;

		$('#quiz-feedback h1').html(right ? 'Right!' : 'Wrong!');
		$('#quiz-feedback h3').html(this.getCurrentQuestion().feedback);

		$('#quiz-feedback-video').remove();

		var $video = $('<video id="quiz-feedback-video" '
						+ 'class="video-js vjs-default-skin" '
						+ 'controls preload="auto" '
						+ 'width="640" '
						+ 'height="264" '
				
						+ '>'
						+ ' <source src="movies/'+ this.currentQuestion +'.webm" type="video/webm" />'
						+ '</video>')
			.appendTo('#quiz-feedback-video-container')
		;

		videojs("quiz-feedback-video", {}, function(){
			this.play();
		});

		this.addNextButton();

	},

	addNextButton: function() {

		var last = (this.currentQuestion + 1) == this.questions.length;

		$('#quiz-feedback .button.next').remove();

		var $buttonNext = $('<a href="#" class="button next">'
							+ (last ? 'Finish' : 'Next')
							+ '</a>')
			.appendTo('#quiz-feedback');

		$buttonNext.click(function(event) {

			event.preventDefault();

			if (last) {

				this.last();
			} else {
				this.next();
			}
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


$(function() {


	application = new Application();

});