# The Ongehoord Quiz script
A quiz that can be operated using physical buttons. The button mapping can be adjusted in a button map file. The quiz loads questions from a questions file and in the end it gives you a score with feedback that depends on your score and is loaded from a feedback file.
The quiz is built on HTML, Javascript and LESS, is built with grunt, loads dependencies with Bower and makes use of jQuery, require, RSVP promises, chartist and videojs.
The quiz will run in browser kiosk-mode in an interactive room in a city bus.
## How to install
### 1. clone repository
~~~bash
$ git clone https://github.com/dipodidae/ongehoord-quiz.git
~~~
### 2. install nodejs and dependencies
~~~bash
$ sudo apt-get update
$ sudo apt-get install nodejs
$ sudo apt-get install npm
$ npm install
~~~
### 3. install dependencies with Bower
~~~bash
$ cd ongehoord-quiz
$ bower install
~~~
### 4. compile LESS
~~~bash
$ grunt build
~~~
### 5. run http-server
~~~bash
$ http-server .
~~~

## Question maintainance
Questions are located in `js/lib/questions.js` and formatted in json.
