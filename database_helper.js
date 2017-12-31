'use strict';
module.change_code = 1;

var DUBLINBUS_DATA_TABLE_NAME = 'dublinBusData';
/*
var localUrl = 'http://localhost:4000';
var localCredentials = {
  region: 'eu-east-1',
  accessKeyId: 'fake',
  secretAccessKey: 'fake'
};

var dynasty = require('dynasty')(localCredentials, localUrl);
*/
var dynasty = require('dynasty')({});

function DatabaseHelper() {
}

var busStopTable = function() {
  return dynasty.table(DUBLINBUS_DATA_TABLE_NAME);
};

DatabaseHelper.prototype.createBusStopTable = function() {
  return dynasty.describe(DUBLINBUS_DATA_TABLE_NAME)
    .catch(function(error) { // if no table is found
      console.log('createDublinBusTable::error: ', error); // log error to console
      return dynasty.create(DUBLINBUS_DATA_TABLE_NAME, {
        key_schema: {
          hash: ['userId', 'string']
        }
      });
    });
};

DatabaseHelper.prototype.storeBusStopData = function(userId, stopData) {
  console.log('Writing stopData to database for user: ' + userId);
  return busStopTable().insert({
    userId: userId,
    data: JSON.stringify(stopData)
  }).catch(function(error) {
    console.log(error);
  });
};

DatabaseHelper.prototype.readBusStopData = function(userId, stopName) {
  console.log('Reading stopInfo data for user with id ' + userId);

  return busStopTable().find(userId)
    .then(function(result) {
      if (result !== undefined) {
        var data = JSON.parse(result['data']);
        //var data = { stops: [{"name":"test1", "number":2068}, {"name":"test2", "number":765}, {"name":"test3", "number":433}]};
        var stopNumber = 0;
        for (var i in data.stops) {
          if (data.stops[i].name == stopName) {
            stopNumber = data.stops[i].number;
            console.log("stop number: " + stopNumber);
          }
        }
      } else {
        return -1;
      }
      return stopNumber;
    }).catch(function(error) {
      console.log('error: ' + error);
    });
};

module.exports = DatabaseHelper;
