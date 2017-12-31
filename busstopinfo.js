'use strict';
module.change_code = 1;
var _ = require('lodash');
var requestPromise = require('request-promise');
var ENDPOINT = "https://data.dublinked.ie/cgi-bin/rtpi/realtimebusinformation";

function stopInfo() {
}

stopInfo.prototype.getStopStatus = function(stopNumber) {
  var options = {
    method: 'GET',
    uri: ENDPOINT,
    qs: {
      'stopId': stopNumber,
      'maxresults': 5,
      'format': 'json'
    },
    json: true
  };

  return requestPromise(options);
};

stopInfo.prototype.formatStopStatus = function(stopNumber, stopStatusObject) {
  if (stopStatusObject.errorcode == 0) { // check if there are no errors from dublin bus
    var results = stopStatusObject.numberofresults;
    var templateDue = _.template('The <%= busNumber %> is due. ');
    var templateTime = _.template('The <%= busNumber %> bus will arrive in <%= dueTime %> <%= minutes %>');
    var prompt = "";

    for (var i = 0; i < results; i++) {
      var busDueTime = stopStatusObject.results[i].duetime;
      if (busDueTime === 'Due') {
        prompt += templateDue({
          'busNumber': stopStatusObject.results[i].route
        });
      } else {
        prompt += templateTime({
            'busNumber': stopStatusObject.results[i].route,
            'dueTime': busDueTime,
            'minutes': ((parseInt(busDueTime) == 1) ? ('minute. ') : ('minutes. '))
        });
      }
    }

    //console.log("Prompt: " + prompt);
    return prompt;
  } else {
    errorcode = stopStatusObject.errorcode;
    console.log("Dublin Bus returned errorcode: " + errorcode);
    var prompt = "I didn\'t have data for stop number " + errorcode;
    return prompt;
  }
};

module.exports = stopInfo;
