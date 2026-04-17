/**
 * Copyright AdmiralCloud AG - www.admiralcloud.com
 */

const crypto = require('crypto')
// codacy:disable-next-line
const _ = require('lodash')

const acSignature = () => {

  const debugPrefix = _.padEnd('ACSignature', 14)
  const debugPadding = 20

  // Helper function to safely parse GET parameters
  const parseGetParams = (inputParams) => {
    const parsed = {}
    for (const [key, value] of Object.entries(inputParams)) {
      parsed[key] = (value === parseInt(value, 10)) ? parseInt(value) : value
    }
    return parsed
  }

  // Timing-safe hash comparison helper
  const isHashEqual = (hash1, hash2) => {
    if (hash1.length !== hash2.length) { return false }
    // codacy:disable-next-line
    return crypto.timingSafeEqual(Buffer.from(hash1, 'hex'), Buffer.from(hash2, 'hex'))
  }

  // Shared payload sorting logic
  // Version 1 and 2 sort keys alphabetically, version 3+ uses deep sorting
  const sortPayload = (data, version) => {
    if (version < 3) {
      const keys = _.sortBy(_.keys(data), (key) => key)
      const payload = {}
      keys.forEach((key) => {
        payload[key] = data[key]
      })
      return payload
    }
    return deepSortObjectKeys(data)
  }

  const deepSortObjectKeys = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map((item) => deepSortObjectKeys(item))
    }

    if (isObject(obj)) {
      const out = {}
      const sortedEntries = Object.entries(obj).sort(([a], [b]) => a.localeCompare(b))
      for (const [key, value] of sortedEntries) {
        // codacy:disable-next-line
        out[key] = deepSortObjectKeys(value)
      }
      return out
    }

    return obj

    function isObject(o) {
      return Object.prototype.toString.call(o) === '[object Object]'
    }
  }

  // Build hash input string based on version
  const buildHashInput = (version, path, controller, action, identifier, ts, payload) => {
    let valueToHash
    if (version >= 2 && path) {
      valueToHash = _.toLower(path)
    }
    else {
      valueToHash = _.toLower(controller) + '\n' + _.toLower(action)
    }
    
    if (version >= 5 && identifier) {
      valueToHash += '\n' + identifier
    }
    
    return valueToHash + '\n' + ts + (_.isEmpty(payload) ? '' : '\n' + JSON.stringify(payload))
  }

  // Debug output for sign function
  const debugSignOutput = (version, accessKey, path, controller, action, valueToHash, ts, hash) => {
    console.warn(_.pad(`Create Signature V${version}`, 80, '-'))
    if (accessKey) {
      console.warn('%s | %s | %s', debugPrefix, _.padEnd('API Key', debugPadding), accessKey)
    }
    if (version >= 2 && path) {
      console.warn('%s | %s | %s', debugPrefix, _.padEnd('Path', debugPadding), path)
    }
    else {
      console.warn('%s | %s | %s/%s', debugPrefix, _.padEnd('Controller/Action', debugPadding), controller, action)
    }
    console.warn('%s | %s | %s', debugPrefix, _.padEnd('Payload to hash', debugPadding), valueToHash.replace(/\n/g, '/'))
    console.warn('%s | %s | %s', debugPrefix, _.padEnd('Payload length', debugPadding), valueToHash.length)
    console.warn('%s | %s | %s %s', debugPrefix, _.padEnd('TS type', debugPadding), typeof ts, ts)
    console.warn('%s | %s | %s', debugPrefix, _.padEnd('Calculated hash', debugPadding), hash)
    console.warn(_.repeat('-', 80))
  }

  // Debug output for checkSignedPayload function
  const debugCheckOutput = (version, accessKey, path, controller, action, valueToHash, ts, calculatedHash, hash) => {
    console.warn(_.pad(`Check Signature V${version}`, 80, '-'))
    if (accessKey) {
      console.warn('%s | %s | %s', debugPrefix, _.padEnd('API Key', debugPadding), accessKey)
    }
    if (version === 2) {
      console.warn('%s | %s | %s', debugPrefix, _.padEnd('Path', debugPadding), path)
    }
    else {
      console.warn('%s | %s | %s/%s', debugPrefix, _.padEnd('Controller/Action', debugPadding), controller, action)
    }
    console.warn('%s | %s | %s', debugPrefix, _.padEnd('Payload to hash', debugPadding), valueToHash.replace(/\n/g, '/'))
    console.warn('%s | %s | %s', debugPrefix, _.padEnd('Payload length', debugPadding), valueToHash.length)
    console.warn('%s | %s | %s %s', debugPrefix, _.padEnd('TS type', debugPadding), typeof ts, ts)
    console.warn('%s | %s | %s', debugPrefix, _.padEnd('Expected hash', debugPadding), calculatedHash)
    console.warn('%s | %s | %s', debugPrefix, _.padEnd('Sent hash', debugPadding), hash)
    
    const result = isHashEqual(calculatedHash, hash) ? '\x1b[32m\u2714\x1b[0m OK' : '\x1b[31m\u274C\x1b[0m FAILED'
    console.warn('%s | %s | %s', debugPrefix, _.padEnd('Result', debugPadding), result)
    console.warn(_.repeat('-', 80))
  }

  const sign5 = (params) => {
    return sign(params, { version: 5 })
  }

  const sign2 = (params) => {
    return sign(params, { version: 2 })
  }

  const sign = (params, options) => {
    const path = (_.get(params, 'path') || '').split('?')[0]
    const version = parseInt(_.get(options, 'version', (_.isString(path) ? 2 : 1)))

    const requirements = ['accessSecret']
    if (version < 2) { requirements.push('controller', 'action') }
    const missingProp = requirements.find(prop => !params[prop])
    if (missingProp) { return `${missingProp}_missing` }
    
    const { accessKey, accessSecret, controller, action, identifier, debug: debugMode } = params
    
    const data = _.isObject(params.payload) && params.payload || {}
    const ts = _.get(params, 'ts', parseInt(Date.now()/1000))
    

    const payload = sortPayload(data, version)
    const valueToHash = buildHashInput(version, path, controller, action, identifier, ts, payload)
    const mechanism = crypto.createHmac('sha256', accessSecret)
    const hash = mechanism.update(valueToHash).digest("hex")

    if (debugMode) {
      debugSignOutput(version, accessKey, path, controller, action, valueToHash, ts, hash)
    }

    return { hash, timestamp: ts }
  }

  const checkSignedPayload = (params, options) => {
    const { path, method, headers, accessSecret, deviation = 10, errorPrefix = 'acsignature' } = options

    const controller = _.toLower(_.get(options, 'controller'))
    const action = _.toLower(_.get(options, 'action'))
    const hash = _.get(options, 'hash', _.get(headers, 'x-admiralcloud-hash'))
    const accessKey = _.get(options, 'accessKey', _.get(headers, 'x-admiralcloud-accesskey'))
    const ts = parseInt(_.get(options, 'rts', _.get(headers, 'x-admiralcloud-rts')))
    const identifier = _.get(options, 'identifier', _.get(headers, 'x-admiralcloud-identifier'))
    const version = parseInt(_.get(options, 'version', _.get(headers, 'x-admiralcloud-version', (_.isString(path) ? 2 : 1))))
    const debugSignature = _.get(options, 'debugSignature', _.get(headers, 'x-admiralcloud-debugsignature'))

    if (!hash) {
      const error = { message: errorPrefix + '_hashMissing', status: 401 }
      return error
    }

    if (deviation) {
      const now = Date.now() / 1000
      const min = now - deviation
      const max = now + deviation
      if (ts < min || ts > max) {
        const error = { message: errorPrefix + '_rtsDeviation', status: 401, additionalInfo: { ts, deviation } }
        return error
      }
    }

    // Parse GET parameters
    if (method === 'GET') {
      params = parseGetParams(params)
    }

    const payload = sortPayload(params, version)
    const valueToHash = buildHashInput(version, path, controller, action, identifier, ts, payload)
    const mechanism = crypto.createHmac('sha256', accessSecret)
    const calculatedHash = mechanism.update(valueToHash).digest('hex')

    if (debugSignature || !isHashEqual(calculatedHash, hash)) {
      debugCheckOutput(version, accessKey, path, controller, action, valueToHash, ts, calculatedHash, hash)
    }

    let error
    if (!isHashEqual(calculatedHash, hash)) { error = { message: errorPrefix + '_hashMismatch', status: 401 } }
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