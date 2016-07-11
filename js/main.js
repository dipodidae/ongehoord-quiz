function ongehoordQuiz() {
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

		this.show();

		this.loadCurrentQuestion();
	},

	show: function() {

		$('.element-main').hide();

		this.elements.quiz.show();
	},

	loadCurrentQuestion: function() {

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

		var $video = $('<video id="quiz-feedback-video" '
						+'class="video-js vjs-default-skin" '
						+'controls preload="auto" '
						+'width="640" '
						+'height="264" '
						+'poster="http://video-js.zencoder.com/oceans-clip.png" '
						+'data-setup=\'{"example_option":true}\'>'
						+' <source src="movies/'+ this.currentQuestion +'.webm" type="video/webm" />'
						+'</video>')
			.appendTo('#quiz-feedback-video-container')
		;

		videojs("quiz-feedback-video", {}, function(){
			this.play();
		});

	}
}


$(function() {

	$('#welcome').show();

	$('#quiz-start-button').bind('click', function(event) {
	
		event.preventDefault();

		var quiz = new ongehoordQuiz();
	})

});