'use strict';
module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');
var skill = new Alexa.app('dublinbus');
var busStopInfo = require('./busstopinfo.js');

skill.launch(function(request, response) {
  var prompt = "Welcome, "
    + "To get real time information for a stop tell me your stop number";
  var reprompt = "You can tell me your stop number to get real time information";
  console.log(prompt);
  response.say(prompt).reprompt(reprompt).shouldEndSession(false);
});

skill.intent('stopNumberInfoIntent', {
    'slots': {
      'STOPNUMBER': 'AMAZON.NUMBER'
    },
    'utterances': ['{|search} {|for} {|stop} {|number} {-|STOPNUMBER}']
  }, function(request, response) {
    var stopNumber = request.slot('STOPNUMBER');

    console.log("Stop Number: " + stopNumber);
    var reprompt = "Tell me your bus stop number";
    if (_.isEmpty(stopNumber)) {
      var prompt = "Sorry, I didn\'t hear your stop number, what's your stop number?";
      console.log("Error getting stop number");
      response.say(prompt).reprompt(reprompt).shouldEndSession(false);
    } else {
      var stopInfo = new busStopInfo();

      return stopInfo.getStopStatus(stopNumber).then(function(stopStatusObject) {
        //console.log(stopStatusObject);
        var prompt = stopInfo.formatStopStatus(stopNumber, stopStatusObject);
        console.log("prompt: " + prompt);
        response.say(prompt).shouldEndSession(true).send();
      }).catch(function(err) {
        console.log("error getting stop info: " + err);
        var prompt = "I didn\'t have data for stop number " + stopNumber;
        response.say(prompt).shouldEndSession(true).send();
      });
    }
  }
);

module.exports = skill;
