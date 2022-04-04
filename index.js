/**
 * Copyright mmpro film- und medienproduktion GmbH and other Node contributors
 *
 */

const crypto = require('crypto');
const _ = require('lodash');

const acSignature = () => {

  const sign2 = (params) => {
    const accessSecret = params.accessSecret;
    if (!accessSecret) return 'accessSecretMissing';
    const path = params.path;
    if (!path) return 'pathMissing';

    // make sure payload keys are ordered from A-Z!
    const data = (_.isObject(params.payload) && params.payload) || {};
    if (!data) return 'payloadMustBeObject';

    const keys = _.sortBy(_.keys(data), (key) => {
      return key;
    });
    const payload = {};
    _.each(keys, (key) => {
      payload[key] = data[key];
    });

    const ts = _.get(params, 'ts', parseInt(new Date().getTime() / 1000));
    const valueToHash = _.toLower(path) + '\n' + ts + '\n' + JSON.stringify(payload);
    const mechanism = crypto.createHmac('sha256', accessSecret);
    const hash = mechanism.update(valueToHash).digest('hex');

    return {
      hash,
      timestamp: ts,
    };
  };

  const sign = (params) => {
    const accessSecret = params.accessSecret;
    if (!accessSecret) return 'accessSecretMissing';
    const controller = params.controller;
    if (!controller) return 'controllerMissing';
    const action = params.action;
    if (!action) return 'actionMissing';
    const data = _.isObject(params.payload) && params.payload;
    if (!data) return 'payloadMustBeObject';
    // debugging
    const accessKey = _.get(params, 'accessKey') // only for debugging

    // make sure payload keys are ordered from A-Z!
    const keys = _.sortBy(_.keys(data), key => {
      return key;
    });
    const payload = {};
    _.each(keys, key => {
      payload[key] = data[key];
    });

    // for debugging you can use your own timestamp
    const ts = _.get(params, 'ts', parseInt(new Date().getTime()/1000))
    const valueToHash = _.toLower(controller) + '\n' + _.toLower(action) + '\n' + ts + (_.isEmpty(payload) ? '' : '\n'+JSON.stringify(payload));
    const mechanism = crypto.createHmac('sha256',accessSecret);
    const hash = mechanism.update(valueToHash).digest("hex");

    if (params.debug) {
      const debugPrefix = _.padEnd('ACSignature', 14)
      const debugPadding = 20
      console.log(_.pad('Create Signature', 80, '-'))
      if (accessKey) console.log('%s | %s | %s', debugPrefix, _.padEnd('API Key', debugPadding), accessKey)
      console.log('%s | %s | %s/%s', debugPrefix, _.padEnd('Controller/Action', debugPadding), controller, action)
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Payload to hash', debugPadding), valueToHash.replace(/\n/g, '/'))
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Payload length', debugPadding), valueToHash.length)
      console.log('%s | %s | %s %s', debugPrefix, _.padEnd('TS type', debugPadding), typeof ts, ts)
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Calculated hash', debugPadding), hash)
      console.log(_.repeat('-', 80))
    }

    return ({
      hash,
      timestamp: ts
    })
  }

  /**
   * params is the request body/url/param params
   * Options are req.headers, accessSecret and optional other options
   */
  const checkSignedPayload = (params, options) => {
    const path = _.get(options, 'path')
    const headers = _.get(options, 'headers')
    const method = _.get(options, 'method')
    const controller = _.toLower(_.get(options, 'controller'))
    const action = _.toLower(_.get(options, 'action'))
    const accessSecret = _.get(options, 'accessSecret')
    const deviation = _.get(options, 'deviation', 10)
   
    // determine by headers
    const hash =  _.get(options, 'hash', _.get(headers, 'x-admiralcloud-hash'))
    const accessKey =  _.get(options, 'accessKey', _.get(headers, 'x-admiralcloud-accesskey'))
    const ts = parseInt( _.get(options, 'rts', _.get(headers, 'x-admiralcloud-rts')))
    const debugSignature =   _.get(options, 'debugSignature', _.get(headers, 'x-admiralcloud-debugsignature'))
    const errorPrefix = _.get(options, 'errorPrefix', 'acsignature')

    if (!hash) {
      let error = { message: errorPrefix + '_hashMissing', status: 401 }
      return error
    }

    if (deviation) {
      const min = new Date().getTime()/1000 - deviation
      const max = new Date().getTime()/1000 + deviation
      if (ts < min || ts > max) {
        let error = { message: errorPrefix + '_rtsDeviation', status: 401, additionalInfo: { ts, deviation } }
        return error
      }
    } 

    // GET request send parameters as string instead of integer -> parse that here (see route.js for parameters)
    if (method === 'GET') {
      for (let key in params) {
        if (params[key] === parseInt(params[key], 10)) {
          params[key] = parseInt(params[key])
        }
      }
    }

    // make sure payload keys are ordered from A-Z!
    let keys = _.sortBy(_.keys(params), key => {
      return key
    })
    let payload = {}
    _.forEach(keys, key => {
      payload[key] = params[key]
    })


    // Check payload against hash ] Hash is calculated -- FORMAT V2
    const valueToHash2 = _.toLower(path) + '\n' + ts + '\n' + JSON.stringify(payload);
    const mechanism2 = crypto.createHmac('sha256', accessSecret);
    const calculatedHash2 = mechanism2.update(valueToHash2).digest('hex');
    if (calculatedHash2 === hash) return undefined;

    // Check payload against hash ] Hash is calculated -- FORMAT V1
    const valueToHash = controller + '\n' + action + '\n' + ts + (_.isEmpty(payload) ? '' : '\n' + JSON.stringify(payload))
    const mechanism = crypto.createHmac('sha256', accessSecret)
    const calculatedHash = mechanism.update(valueToHash).digest('hex')

    if (debugSignature || calculatedHash !== hash) {
      const debugPrefix = _.padEnd('ACSignature', 14)
      const debugPadding = 20
      console.log(_.pad('Check Signature', 80, '-'))
      console.log('%s | %s | %s', debugPrefix, _.padEnd('API Key', debugPadding), accessKey)
      console.log('%s | %s | %s/%s', debugPrefix, _.padEnd('Controller/Action', debugPadding), controller, action)
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Payload to hash', debugPadding), valueToHash.replace(/\n/g, '/'))
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Payload length', debugPadding), valueToHash.length)
      console.log('%s | %s | %s %s', debugPrefix, _.padEnd('TS type', debugPadding), typeof ts, ts)
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Expected hash', debugPadding), calculatedHash)
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Sent hash', debugPadding), hash)
      console.log(_.repeat('-', 80))
    }

    let error
    if (calculatedHash !== hash) error = { message: errorPrefix + '_hashMismatch', status: 401 }
    return error
  }

  return {
    sign,
    sign2,
    checkSignedPayload
  }

}
module.exports = acSignature()
