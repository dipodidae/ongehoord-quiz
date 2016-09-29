# ongehoord-quiz
This is a pure html/javascript quiz that is built with jQuery, require, RSVP promises, chartist and videojs. Its dependencies are maintained with Bower.
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
$ npm install bower http-server
~~~
### 3. install dependencies with Bower
~~~bash
$ cd ongehoord-quiz
$ bower install
~~~
### 4. run http-server
~~~bash
$ http-server .
~~~

## Question maintainance
Questions are located in `js/lib/questions.js` and formatted in json.
