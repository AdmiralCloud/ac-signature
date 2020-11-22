const expect = require('expect')
const acsignature = require('../index')
const _ = require('lodash')

describe('Test signature', function () {
  const accessKey = Math.random().toString('36')
  const accessSecret = Math.random().toString('36')

  const controller = 'user'
  const action = 'mefind'


  it('Check with empty payload', (done) => {
    let payload = {}
    let params = {
      accessSecret,
      controller,
      action,
      payload   
    }
    let signedValues = acsignature.sign(params)

    let options = {
      controller,
      action,
      accessSecret,
      hash: _.get(signedValues, 'hash'),
      accessKey,
      rts: _.get(signedValues, 'timestamp')
    }
    let result = acsignature.checkSignedPayload(payload, options)
    expect(result).toBeUndefined()
    return done()
  })

  it('Send wrong hash', (done) => {
    let payload = {}
    let params = {
      accessSecret,
      controller,
      action,
      payload   
    }
    let signedValues = acsignature.sign(params)
    let options = {
      controller,
      action,
      accessSecret,
      hash: 'ANBC',
      accessKey,
      rts: _.get(signedValues, 'timestamp')
    }
    let result = acsignature.checkSignedPayload(payload, options)
    expect(result).toEqual({ "message": "acsignature_hashMismatch", "status": 401 })
    return done()
  })


  it('Send wrong timestamp', (done) => {
    let payload = {}
    let params = {
      accessSecret,
      controller,
      action,
      payload   
    }
    let signedValues = acsignature.sign(params)
    let options = {
      controller,
      action,
      accessSecret,
      hash: _.get(signedValues, 'hash'),
      accessKey,
      rts: Date.now()/1000+100
    }
    let result = acsignature.checkSignedPayload(payload, options)
    expect(result).toEqual({ "message": "acsignature_rtsDeviation", "status": 401 })
    return done()
  })

  it('Check with payload', (done) => {
    let payload = {
      key1: true,
      key2: 'is a string',
      key3: ['arrayValue1', 'arrayValue2'],
      key4: {
        isEnabled: true
      }
    }
    let params = {
      accessSecret,
      controller,
      action,
      payload   
    }
    let signedValues = acsignature.sign(params)

    let options = {
      controller,
      action,
      accessSecret,
      hash: _.get(signedValues, 'hash'),
      accessKey,
      rts: _.get(signedValues, 'timestamp')
    }
    let result = acsignature.checkSignedPayload(payload, options)
    expect(result).toBeUndefined()
    return done()
  })

})
