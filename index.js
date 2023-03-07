/**
 * Copyright AdmiralCloud AG - www.admiralcloud.com
 */

const crypto = require('crypto')
const _ = require('lodash')

const acSignature = () => {
  const debugPrefix = _.padEnd('ACSignature', 14)
  const debugPadding = 20

  // v1: controller/action + nested json bugs
  const sign_v1 = (params) => {
    const accessSecret = params.accessSecret
    if (!accessSecret) return 'accessSecretMissing'
    const accessKey = _.get(params, 'accessKey') // only for debugging
    const data = (_.isObject(params.payload) && params.payload) || {}

    // for debugging you can use your own timestamp
    const ts = _.get(params, 'ts', parseInt(new Date().getTime() / 1000))
    const debugMode = _.get(params, 'debug')

    if (debugMode) {
      console.log(_.pad(`Create Signature V1`, 80, '-'))
      if (accessKey) console.log('%s | %s | %s', debugPrefix, _.padEnd('API Key', debugPadding), accessKey)
    }

    let payload = {}
    // sort order fileName, filename
    let keys = _.sortBy(_.keys(data), (key) => {
      return key
    })
    _.each(keys, (key) => {
      payload[key] = data[key]
    })

    let valueToHash
    const controller = params.controller
    if (!controller) return 'controllerMissing'
    const action = params.action
    if (!action) return 'actionMissing'
    valueToHash = _.toLower(controller) + '\n' + _.toLower(action)
    if (debugMode) {
      console.log('%s | %s | %s/%s', debugPrefix, _.padEnd('Controller/Action', debugPadding), controller, action)
    }

    valueToHash += '\n' + ts + (_.isEmpty(payload) ? '' : '\n' + JSON.stringify(payload))
    const mechanism = crypto.createHmac('sha256', accessSecret)
    const hash = mechanism.update(valueToHash).digest('hex')

    if (debugMode) {
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Payload to hash', debugPadding), valueToHash.replace(/\n/g, '/'))
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Payload length', debugPadding), valueToHash.length)
      console.log('%s | %s | %s %s', debugPrefix, _.padEnd('TS type', debugPadding), typeof ts, ts)
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Calculated hash', debugPadding), hash)
      console.log(_.repeat('-', 80))
    }

    return {
      hash,
      timestamp: ts,
    }
  }

  // v2: path only + nested json bugs
  const sign_v2 = (params) => {
    const accessSecret = params.accessSecret
    if (!accessSecret) return 'accessSecretMissing'
    const accessKey = _.get(params, 'accessKey') // only for debugging
    const data = (_.isObject(params.payload) && params.payload) || {}
    const path = _.get(params, 'path')
    if (!path) return 'pathMissing'

    // for debugging you can use your own timestamp
    const ts = _.get(params, 'ts', parseInt(new Date().getTime() / 1000))
    const debugMode = _.get(params, 'debug')

    if (debugMode) {
      console.log(_.pad(`Create Signature V2`, 80, '-'))
      if (accessKey) console.log('%s | %s | %s', debugPrefix, _.padEnd('API Key', debugPadding), accessKey)
    }

    let payload = {}
    // sort order fileName, filename
    let keys = _.sortBy(_.keys(data), (key) => {
      return key
    })
    _.each(keys, (key) => {
      payload[key] = data[key]
    })

    let valueToHash
    valueToHash = _.toLower(path)
    if (debugMode) {
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Path', debugPadding), path)
    }

    valueToHash += '\n' + ts + (_.isEmpty(payload) ? '' : '\n' + JSON.stringify(payload))
    const mechanism = crypto.createHmac('sha256', accessSecret)
    const hash = mechanism.update(valueToHash).digest('hex')

    if (debugMode) {
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Payload to hash', debugPadding), valueToHash.replace(/\n/g, '/'))
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Payload length', debugPadding), valueToHash.length)
      console.log('%s | %s | %s %s', debugPrefix, _.padEnd('TS type', debugPadding), typeof ts, ts)
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Calculated hash', debugPadding), hash)
      console.log(_.repeat('-', 80))
    }

    return {
      hash,
      timestamp: ts,
    }
  }

  // v3: controller/action OR path + headers required + no json bugs
  const sign_v3 = (params) => {
    const accessSecret = params.accessSecret
    if (!accessSecret) return 'accessSecretMissing'
    const accessKey = _.get(params, 'accessKey') // only for debugging
    const data = (_.isObject(params.payload) && params.payload) || {}
    const path = _.get(params, 'path')

    // for debugging you can use your own timestamp
    const ts = _.get(params, 'ts', parseInt(new Date().getTime() / 1000))
    const debugMode = _.get(params, 'debug')

    if (debugMode) {
      console.log(_.pad(`Create Signature V3`, 80, '-'))
      if (accessKey) console.log('%s | %s | %s', debugPrefix, _.padEnd('API Key', debugPadding), accessKey)
    }

    let payload = deepSortObjectKeys(data)

    let valueToHash
    // support both path and controller/action
    if (path) {
      valueToHash = _.toLower(path)
      if (debugMode) {
        console.log('%s | %s | %s', debugPrefix, _.padEnd('Path', debugPadding), path)
      }
    } else {
      // controller/action hashing
      const controller = params.controller
      if (!controller) return 'controllerMissing'
      const action = params.action
      if (!action) return 'actionMissing'
      valueToHash = _.toLower(controller) + '\n' + _.toLower(action)
      if (debugMode) {
        console.log('%s | %s | %s/%s', debugPrefix, _.padEnd('Controller/Action', debugPadding), controller, action)
      }
    }

    valueToHash += '\n' + ts + (_.isEmpty(payload) ? '' : '\n' + JSON.stringify(payload))
    const mechanism = crypto.createHmac('sha256', accessSecret)
    const hash = mechanism.update(valueToHash).digest('hex')

    if (debugMode) {
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Payload to hash', debugPadding), valueToHash.replace(/\n/g, '/'))
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Payload length', debugPadding), valueToHash.length)
      console.log('%s | %s | %s %s', debugPrefix, _.padEnd('TS type', debugPadding), typeof ts, ts)
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Calculated hash', debugPadding), hash)
      console.log(_.repeat('-', 80))
    }

    return {
      hash,
      timestamp: ts,
    }
  }

  // v4: path only + no json bugs
  const sign_v4 = (params) => {
    const accessSecret = params.accessSecret
    if (!accessSecret) return 'accessSecretMissing'
    const accessKey = _.get(params, 'accessKey') // only for debugging
    const data = (_.isObject(params.payload) && params.payload) || {}
    const path = _.get(params, 'path')
    if (!path) return 'pathMissing'

    // for debugging you can use your own timestamp
    const ts = _.get(params, 'ts', parseInt(new Date().getTime() / 1000))
    const debugMode = _.get(params, 'debug')

    if (debugMode) {
      console.log(_.pad(`Create Signature V3`, 80, '-'))
      if (accessKey) console.log('%s | %s | %s', debugPrefix, _.padEnd('API Key', debugPadding), accessKey)
    }

    let payload = deepSortObjectKeys(data)

    let valueToHash = _.toLower(path)
    if (debugMode) {
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Path', debugPadding), path)
    }

    valueToHash += '\n' + ts + (_.isEmpty(payload) ? '' : '\n' + JSON.stringify(payload))
    const mechanism = crypto.createHmac('sha256', accessSecret)
    const hash = 'v4:' + mechanism.update(valueToHash).digest('hex')

    if (debugMode) {
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Payload to hash', debugPadding), valueToHash.replace(/\n/g, '/'))
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Payload length', debugPadding), valueToHash.length)
      console.log('%s | %s | %s %s', debugPrefix, _.padEnd('TS type', debugPadding), typeof ts, ts)
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Calculated hash', debugPadding), hash)
      console.log(_.repeat('-', 80))
    }

    return {
      hash,
      timestamp: ts,
    }
  }

  const sign = (params, options) => {
    const version = _.get(options, 'version', 1)

    // v1: controller/action + nested json bugs
    if (version === 1) {
      return sign_v1(params)
    }

    // v2: path only + nested json bugs
    if (version === 2) {
      return sign_v2(params)
    }

    // v3: controller/action OR path + header required + no json bugs
    if (version === 3) {
      return sign_v3(params)
    }

    // v4: path only + no json bugs
    if (version === 4) {
      return sign_v4(params)
    }

    return 'badVersion'
  }

  // v1: controller/action + nested json bugs
  const checkSignedPayload_v1 = (params, options) => {
    const headers = _.get(options, 'headers')
    const method = _.get(options, 'method')
    const controller = _.toLower(_.get(options, 'controller'))
    const action = _.toLower(_.get(options, 'action'))
    const accessSecret = _.get(options, 'accessSecret')
    const deviation = _.get(options, 'deviation', 10)

    // determine by headers
    const hash = _.get(options, 'hash', _.get(headers, 'x-admiralcloud-hash'))
    const accessKey = _.get(options, 'accessKey', _.get(headers, 'x-admiralcloud-accesskey'))
    const ts = parseInt(_.get(options, 'rts', _.get(headers, 'x-admiralcloud-rts')))

    const debugSignature = _.get(options, 'debugSignature', _.get(headers, 'x-admiralcloud-debugsignature'))
    const errorPrefix = _.get(options, 'errorPrefix', 'acsignature')

    if (deviation) {
      const min = new Date().getTime() / 1000 - deviation
      const max = new Date().getTime() / 1000 + deviation
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
    // sort order fileName, filename
    let keys = _.sortBy(_.keys(params), (key) => {
      return key
    })
    _.each(keys, (key) => {
      payload[key] = params[key]
    })

    let valueToHash = controller + '\n' + action

    // Check payload against hash ] Hash is calculated
    valueToHash += '\n' + ts + (_.isEmpty(payload) ? '' : '\n' + JSON.stringify(payload))
    const mechanism = crypto.createHmac('sha256', accessSecret)
    const calculatedHash = mechanism.update(valueToHash).digest('hex')

    if (debugSignature || calculatedHash !== hash) {
      console.log(_.pad(`Check Signature V1`, 80, '-'))
      if (accessKey) {
        console.log('%s | %s | %s', debugPrefix, _.padEnd('API Key', debugPadding), accessKey)
      }
      console.log('%s | %s | %s/%s', debugPrefix, _.padEnd('Controller/Action', debugPadding), controller, action)
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

  // v2: path only + nested json bugs
  const checkSignedPayload_v2 = (params, options) => {
    const path = _.get(options, 'path')
    const headers = _.get(options, 'headers')
    const method = _.get(options, 'method')
    const accessSecret = _.get(options, 'accessSecret')
    const deviation = _.get(options, 'deviation', 10)

    // determine by headers
    const hash = _.get(options, 'hash', _.get(headers, 'x-admiralcloud-hash'))
    const accessKey = _.get(options, 'accessKey', _.get(headers, 'x-admiralcloud-accesskey'))
    const ts = parseInt(_.get(options, 'rts', _.get(headers, 'x-admiralcloud-rts')))

    const debugSignature = _.get(options, 'debugSignature', _.get(headers, 'x-admiralcloud-debugsignature'))
    const errorPrefix = _.get(options, 'errorPrefix', 'acsignature')

    if (deviation) {
      const min = new Date().getTime() / 1000 - deviation
      const max = new Date().getTime() / 1000 + deviation
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
    // sort order fileName, filename
    let keys = _.sortBy(_.keys(params), (key) => {
      return key
    })
    _.each(keys, (key) => {
      payload[key] = params[key]
    })

    let valueToHash = _.toLower(path)

    // Check payload against hash ] Hash is calculated
    valueToHash += '\n' + ts + (_.isEmpty(payload) ? '' : '\n' + JSON.stringify(payload))
    const mechanism = crypto.createHmac('sha256', accessSecret)
    const calculatedHash = mechanism.update(valueToHash).digest('hex')

    if (debugSignature || calculatedHash !== hash) {
      console.log(_.pad(`Check Signature V2`, 80, '-'))
      if (accessKey) {
        console.log('%s | %s | %s', debugPrefix, _.padEnd('API Key', debugPadding), accessKey)
      }
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Path', debugPadding), path)
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

  // v3: controller/action OR path + headers required + no json bugs
  const checkSignedPayload_v3 = (params, options) => {
    const path = _.get(options, 'path')
    const headers = _.get(options, 'headers')
    const method = _.get(options, 'method')
    const controller = _.toLower(_.get(options, 'controller'))
    const action = _.toLower(_.get(options, 'action'))
    const accessSecret = _.get(options, 'accessSecret')
    const deviation = _.get(options, 'deviation', 10)

    // determine by headers
    const hash = _.get(options, 'hash', _.get(headers, 'x-admiralcloud-hash'))
    const accessKey = _.get(options, 'accessKey', _.get(headers, 'x-admiralcloud-accesskey'))
    const ts = parseInt(_.get(options, 'rts', _.get(headers, 'x-admiralcloud-rts')))

    const debugSignature = _.get(options, 'debugSignature', _.get(headers, 'x-admiralcloud-debugsignature'))
    const errorPrefix = _.get(options, 'errorPrefix', 'acsignature')

    if (deviation) {
      const min = new Date().getTime() / 1000 - deviation
      const max = new Date().getTime() / 1000 + deviation
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
    let payload = deepSortObjectKeys(params)

    let valueToHash = controller + '\n' + action
    if (path) {
      valueToHash = _.toLower(path)
    }

    // Check payload against hash ] Hash is calculated
    valueToHash += '\n' + ts + (_.isEmpty(payload) ? '' : '\n' + JSON.stringify(payload))
    const mechanism = crypto.createHmac('sha256', accessSecret)
    const calculatedHash = mechanism.update(valueToHash).digest('hex')

    if (debugSignature || calculatedHash !== hash) {
      console.log(_.pad(`Check Signature V3`, 80, '-'))
      if (accessKey) {
        console.log('%s | %s | %s', debugPrefix, _.padEnd('API Key', debugPadding), accessKey)
      }
      if (path) {
        console.log('%s | %s | %s', debugPrefix, _.padEnd('Path', debugPadding), path)
      } else {
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

  // v4: path only + no json bugs
  const checkSignedPayload_v4 = (params, options) => {
    const path = _.get(options, 'path')
    const headers = _.get(options, 'headers')
    const method = _.get(options, 'method')
    const accessSecret = _.get(options, 'accessSecret')
    const deviation = _.get(options, 'deviation', 10)

    // determine by headers
    let hash = _.get(options, 'hash', _.get(headers, 'x-admiralcloud-hash'))
    const accessKey = _.get(options, 'accessKey', _.get(headers, 'x-admiralcloud-accesskey'))
    const ts = parseInt(_.get(options, 'rts', _.get(headers, 'x-admiralcloud-rts')))

    const debugSignature = _.get(options, 'debugSignature', _.get(headers, 'x-admiralcloud-debugsignature'))
    const errorPrefix = _.get(options, 'errorPrefix', 'acsignature')

    // hashes always start with "v4:"
    hash = hash.substr(3)

    if (deviation) {
      const min = new Date().getTime() / 1000 - deviation
      const max = new Date().getTime() / 1000 + deviation
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
    let payload = deepSortObjectKeys(params)

    let valueToHash = _.toLower(path)

    // Check payload against hash ] Hash is calculated
    valueToHash += '\n' + ts + (_.isEmpty(payload) ? '' : '\n' + JSON.stringify(payload))
    const mechanism = crypto.createHmac('sha256', accessSecret)
    const calculatedHash = mechanism.update(valueToHash).digest('hex')

    if (debugSignature || calculatedHash !== hash) {
      console.log(_.pad(`Check Signature V4`, 80, '-'))
      if (accessKey) {
        console.log('%s | %s | %s', debugPrefix, _.padEnd('API Key', debugPadding), accessKey)
      }
      console.log('%s | %s | %s', debugPrefix, _.padEnd('Path', debugPadding), path)
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

  /**
   * params is the request body/url/param params
   * Options are req.headers, accessSecret and optional other options
   */
  const checkSignedPayload = (params, options) => {
    const headers = _.get(options, 'headers')
    const path = _.get(options, 'path')
    const hash = _.get(options, 'hash', _.get(headers, 'x-admiralcloud-hash'))
    const errorPrefix = _.get(options, 'errorPrefix', 'acsignature')

    if (!hash) {
      let error = { message: errorPrefix + '_hashMissing', status: 401 }
      return error
    }

    // v4: path only + no json bugs
    if (hash.startsWith('v4:')) {
      return checkSignedPayload_v4(params, options)
    }

    // v3: controller/action OR path + header required + no json bugs
    if (parseInt(_.get(options, 'version', _.get(headers, 'x-admiralcloud-version', 0))) === 3) {
      return checkSignedPayload_v3(params, options)
    }

    // v2: path only + nested json bugs
    if (_.isString(path)) {
      return checkSignedPayload_v2(params, options)
    }

    // v1: controller/action + nested json bugs
    return checkSignedPayload_v1(params, options)
  }

  return {
    sign,
    // sign2, // this function can be safely removed see https://github.com/search?q=org%3AAdmiralCloud+acsignature.sign2&type=Code
    checkSignedPayload,
  }
}
module.exports = acSignature()

function deepSortObjectKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map((item) => deepSortObjectKeys(item))
  }

  if (isObject(obj)) {
    let out = {}
    Object.keys(obj)
      .sort((a, b) => a.localeCompare(b))
      .forEach(function (key) {
        out[key] = deepSortObjectKeys(obj[key])
      })
    return out
  }

  return obj

  function isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]'
  }
}
