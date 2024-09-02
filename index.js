/**
 * Copyright AdmiralCloud AG - www.admiralcloud.com
 */

const crypto = require('crypto')
const _ = require('lodash')

const acSignature = () => {

  const debugPrefix = _.padEnd('ACSignature', 14)
  const debugPadding = 20

  const sign5 = (params) => {
    return sign(params, { version: 5 })
  }

  const sign2 = (params) => {
    return sign(params, { version: 2 })
  }

  const sign = (params, options) => {
    const accessSecret = params.accessSecret
    if (!accessSecret) return 'accessSecretMissing'
    // accessKey only required for debugging
    const accessKey = _.get(params, 'accessKey') // only for debugging
    const data = _.isObject(params.payload) && params.payload || {}
    const path = (_.get(params, 'path') || '').split('?')[0] // make sure the path is just the path - get rid of any query parameters
    const identifier = _.get(params, 'identifier') // identifier header for requests "on behalf"

    // for debugging you can use your own timestamp
    const ts = _.get(params, 'ts', parseInt(new Date().getTime()/1000))
    const debugMode = _.get(params, 'debug')
    const version = _.get(options, 'version', 1)
    
    if (debugMode) {
      console.log(_.pad(`Create Signature V${version}`, 80, '-'))
      if (accessKey) console.log('%s | %s | %s', debugPrefix, _.padEnd('API Key', debugPadding), accessKey)
    }
 
    let payload = {}
    if (version < 3) {
      // sort order fileName, filename
      let keys = _.sortBy(_.keys(data), (key) => {
        return key
      })
      _.each(keys ,(key) => {
        payload[key] = data[key];
      })
    }
    else {
      payload = deepSortObjectKeys(data)
    }
    
    let valueToHash
    if (version >= 2 && path) {
      // version 2 with path only
      valueToHash = _.toLower(path)
      if (debugMode) {
        console.log('%s | %s | %s', debugPrefix, _.padEnd('Path', debugPadding), path)
      }
    }
    else {
      // version 1 with controller/action
      const controller = params.controller
      if (!controller) return 'controllerMissing'
      const action = params.action
      if (!action) return 'actionMissing'  
      valueToHash = _.toLower(controller) + '\n' + _.toLower(action)
      if (debugMode) {
        console.log('%s | %s | %s/%s', debugPrefix, _.padEnd('Controller/Action', debugPadding), controller, action)
      }
    }
    
    if (version >= 5 && identifier) valueToHash += '\n' + identifier

    valueToHash += '\n' + ts + (_.isEmpty(payload) ? '' : '\n'+JSON.stringify(payload))
    const mechanism = crypto.createHmac('sha256',accessSecret)
    const hash = mechanism.update(valueToHash).digest("hex")

    if (debugMode) {
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
    const identifier = _.get(options, 'identifier', _.get(headers, 'x-admiralcloud-identifier'))
    const version = parseInt(_.get(options, 'version', _.get(headers, 'x-admiralcloud-version', (_.isString(path) ? 2 : 1))))

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
    let payload = {}
    if (version < 3) {
      // sort order fileName, filename
      let keys = _.sortBy(_.keys(params), (key) => {
        return key;
      })
      _.each(keys, (key) => {
        payload[key] = params[key];
      })
    }
    else {
      // sort order filename, fileName
      payload = deepSortObjectKeys(params)
    }

    let valueToHash = controller + '\n' + action
    if (version >= 2 && path) {
      valueToHash = _.toLower(path)
    }
    if (version >= 5 && identifier) valueToHash += '\n' + identifier
    
    // Check payload against hash ] Hash is calculated
    valueToHash += '\n' + ts + (_.isEmpty(payload) ? '' : '\n' + JSON.stringify(payload))
    const mechanism = crypto.createHmac('sha256', accessSecret)
    const calculatedHash = mechanism.update(valueToHash).digest('hex')

    if (debugSignature || calculatedHash !== hash) {
      console.log(_.pad(`Check Signature V${version}`, 80, '-'))
      if (accessKey) {
        console.log('%s | %s | %s', debugPrefix, _.padEnd('API Key', debugPadding), accessKey)
      }
      if (version === 2) {
        // v2 with path
        console.log('%s | %s | %s', debugPrefix, _.padEnd('Path', debugPadding), path)
      }
      else {
        // v1 with controller/action
        console.log('%s | %s | %s/%s', debugPrefix, _.padEnd('Controller/Action', debugPadding), controller, action)
      }
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Payload to hash', debugPadding), valueToHash.replace(/\n/g, '/'))
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Payload length', debugPadding), valueToHash.length)
      console.log('%s | %s | %s %s', debugPrefix, _.padEnd('TS type', debugPadding), typeof ts, ts)
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Expected hash', debugPadding), calculatedHash)
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Sent hash', debugPadding), hash)
      let result = '\x1b[32m\u2714\x1b[0m OK' // OK
      if (calculatedHash !== hash) result = '\x1b[31m\u274C\x1b[0m FAILED'
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Result', debugPadding), result)
      console.log(_.repeat('-', 80))
    }

    let error
    if (calculatedHash !== hash) error = { message: errorPrefix + '_hashMismatch', status: 401 }
    return error
  }

  return {
    sign,
    sign2,
    sign5,
    checkSignedPayload
  }

}
module.exports = acSignature()


function deepSortObjectKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map((item) => deepSortObjectKeys(item));
  }

  if (isObject(obj)) {
    let out = {};
    Object.keys(obj).sort((a, b) => a.localeCompare(b)).forEach(function (key) {
      out[key] = deepSortObjectKeys(obj[key]);
    });
    return out;
  }

  return obj;

  function isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
  }
}
