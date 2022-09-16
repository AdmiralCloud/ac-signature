const expect = require('expect')
const acsignature = require('../index')
const _ = require('lodash')

describe('Test signature format v1', function () {
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
    const timestamp = Date.now()/1000+100;
    let options = {
      controller,
      action,
      accessSecret,
      hash: _.get(signedValues, 'hash'),
      accessKey,
      rts: timestamp,
    }
    let result = acsignature.checkSignedPayload(payload, options)
    expect(result).toEqual({
      message: 'acsignature_rtsDeviation',
      status: 401,

      additionalInfo: {
        deviation: 10,
        ts: Math.floor(timestamp),
      },
    });
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

  it('Check with nested payload and controller/action', (done) => {
    let payload = {
      key2: 'is a string',
      key1: { xtreme: "foo", tags: [{ tagId: 123, flag: 0 }, { tagId: 124, flag: 1 }, null, {}] },
      key4: {
        isFoo: false,
        isEnabled: true
      },
      key3: ['arrayValue1', 'arrayValue2'],
    }
    let payload2 = { // == payload (but nested keys are reordered)
      key2: 'is a string',
      key1: { xtreme: "foo", tags: [{ flag: 0, tagId: 123 }, { flag: 1, tagId: 124 }, null, {}] },
      key4: {
        isEnabled: true,
        isFoo: false,
      },
      key3: ['arrayValue1', 'arrayValue2'],
    }

    let params = {
      accessSecret,
      controller,
      action,
      payload,
    }
    let signedValues = acsignature.sign(params, { version: 3 })

    let options = {
      controller,
      action,
      accessSecret,
      hash: _.get(signedValues, 'hash'),
      accessKey,
      rts: _.get(signedValues, 'timestamp'),
      version: 3
    }
    let result = acsignature.checkSignedPayload(payload2, options)
    expect(result).toBeUndefined()
    return done()
  })

  it('Check with nested payload and path', (done) => {
    let payload = {
      key2: 'is a string',
      key1: { xtreme: "foo", tags: [{ tagId: 123, flag: 0 }, { tagId: 124, flag: 1 }, null, {}] },
      key4: {
        isFoo: false,
        isEnabled: true
      },
      key3: ['arrayValue1', 'arrayValue2'],
    }
    let payload2 = { // == payload (but nested keys are reordered)
      key2: 'is a string',
      key1: { xtreme: "foo", tags: [{ flag: 0, tagId: 123 }, { flag: 1, tagId: 124 }, null, {}] },
      key4: {
        isEnabled: true,
        isFoo: false,
      },
      key3: ['arrayValue1', 'arrayValue2'],
    }

    let params = {
      accessSecret,
      path: '/v1/apiendpoint',
      payload,
    }
    let signedValues = acsignature.sign(params, { version: 3 })

    let options = {
      path: '/v1/apiendpoint',
      accessSecret,
      hash: _.get(signedValues, 'hash'),
      accessKey,
      rts: _.get(signedValues, 'timestamp'),
      version: 3
    }
    let result = acsignature.checkSignedPayload(payload2, options)
    expect(result).toBeUndefined()
    return done()
  })

  it('Check with nested payload containing same prop with different chars and path', (done) => {
    let payload = {
      filename: 'filename in small letters',
      fileName: 'filename in uppercas letters',
      key2: 'is a string',
      key1: { xtreme: "foo", tags: [{ tagId: 123, flag: 0 }, { tagId: 124, flag: 1 }, null, {}] },
      key4: {
        isFoo: false,
        isEnabled: true
      },
      key3: ['arrayValue1', 'arrayValue2'],
    }
    let payload2 = { // == payload (but nested keys are reordered)
      fileName: 'filename in uppercas letters',
      filename: 'filename in small letters',
      key2: 'is a string',
      key1: { xtreme: "foo", tags: [{ flag: 0, tagId: 123 }, { flag: 1, tagId: 124 }, null, {}] },
      key4: {
        isEnabled: true,
        isFoo: false,
      },
      key3: ['arrayValue1', 'arrayValue2'],
    }

    let params = {
      accessSecret,
      path: '/v1/apiendpoint',
      payload,
    }
    let signedValues = acsignature.sign(params, { version: 3 })

    let options = {
      path: '/v1/apiendpoint',
      accessSecret,
      hash: _.get(signedValues, 'hash'),
      accessKey,
      rts: _.get(signedValues, 'timestamp'),
      version: 3
    }
    let result = acsignature.checkSignedPayload(payload2, options)
    expect(result).toBeUndefined()
    return done()
  })

})
