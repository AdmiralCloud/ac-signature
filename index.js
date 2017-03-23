/**
 * Copyright mmpro film- und medienproduktion GmbH and other Node contributors
 *
 */

const crypto = require('crypto');
const _ = require('lodash');

module.exports =  function(params) {

  let accessSecret = params.accessSecret;
  if (!accessSecret) return 'accessSecretMissing';
  let controller = params.controller;
  if (!controller) return 'controllerMissing';
  let action = params.action;
  if (!action) return 'actionMissing';
  let data = _.isObject(params.payload) && params.payload;
  if (!data) return 'payloadMustBeObject';

  // make sure payload keys are ordered from A-Z!
  let keys = _.sortBy(_.keys(data), function (key) {
    return key;
  });
  let payload = {};
  _.each(keys, function(key) {
    payload[key] = data[key];
  });


  let ts = parseInt(new Date().getTime()/1000);
  let valueToHash = _.toLower(controller) + '\n' + _.toLower(action) + '\n' + ts + (_.isEmpty(payload) ? '' : '\n'+JSON.stringify(payload));
  let mechanism = crypto.createHmac('sha256',accessSecret);
  let hash = mechanism.update(valueToHash).digest("hex");

  if (params.debug) {
    console.log('######################')
    console.log("CREATE API Signature")
    console.log("Payload to hash:\n"+valueToHash);
    console.log("Payload length",valueToHash.length);
    console.log("TS", ts, typeof ts)
    console.log("Hash", hash);
    console.log('######################')
  }

  return ({
    hash: hash,
    timestamp: ts
  });

}
