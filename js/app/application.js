define(['lib/questions', 'bower/video.js/dist/video.min'], function(Questions, Videojs) {

	function Quiz(application) {

		this.init();
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

		init: function() {

			this.setQuestions();

			this.loadCurrentQuestion();
		},

		setQuestions: function(questions) {

			this.status.unanswered = Questions.length;
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


					this.updateStatus(right);

					this.loadFeedback(right);

				}.bind(this));

			}.bind(this));
		},

		updateStatus: function(right) {

			this.status.unanswered--;
			this.status[right ? 'right' : 'wrong']++;

		},

		getCurrentQuestion: function() {

			return Questions[this.currentQuestion];
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

			Videojs("quiz-feedback-video", {}, function(){
				this.play();
			});

			this.addNextButton();

		},

		addNextButton: function() {

			var last = (this.currentQuestion + 1) == Questions.length;

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

	return Quiz;
});