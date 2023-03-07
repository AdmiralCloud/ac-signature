const { expect } = require('chai')
const acsignature = require('../index')

// v4: path only + no json bugs
describe('Test signature format v4', function () {
  const accessSecret = Math.random().toString('36')

  it('Check with empty payload', (done) => {
    let signedValues = acsignature.sign({ accessSecret, path: '/v1/me' }, { version: 4 })

    let result = acsignature.checkSignedPayload(
      {},
      {
        path: '/v1/me',
        accessSecret,
        hash: signedValues.hash,
        rts: signedValues.timestamp,
      },
    )
    expect(result).to.be.undefined
    return done()
  })

  it('Check with GET param and no payload', (done) => {
    let signedValues = acsignature.sign({ accessSecret, path: '/v1/user/45345' }, { version: 4 })

    let result = acsignature.checkSignedPayload(
      {},
      {
        path: '/v1/user/45345',
        accessSecret,
        hash: signedValues.hash,
        rts: signedValues.timestamp,
      },
    )

    expect(result).to.be.undefined
    return done()
  })

  it('Send wrong hash', (done) => {
    let signedValues = acsignature.sign({ accessSecret, path: '/v1/me' }, { version: 4 })

    let result = acsignature.checkSignedPayload(
      {},
      {
        path: '/v1/me',
        accessSecret,
        hash: 'v4:BADHASH',
        rts: signedValues.timestamp,
      },
    )
    expect(result).to.eql({ message: 'acsignature_hashMismatch', status: 401 })
    return done()
  })

  it('Error for wrong timestamp', (done) => {
    let signedValues = acsignature.sign({ accessSecret, path: '/v1/me' }, { version: 4 })

    const timestamp = Date.now() / 1000 + 100
    let result = acsignature.checkSignedPayload(
      {},
      {
        path: '/v1/me',
        accessSecret,
        hash: signedValues.hash,
        rts: timestamp,
      },
    )

    expect(result).to.eql({
      message: 'acsignature_rtsDeviation',
      status: 401,

      additionalInfo: {
        deviation: 10,
        ts: Math.floor(timestamp),
      },
    })
    return done()
  })

  it('Error with wrong accessSecret', (done) => {
    let signedValues = acsignature.sign({ accessSecret, path: '/v1/me' }, { version: 4 })

    let result = acsignature.checkSignedPayload(
      {},
      {
        path: '/v1/me',
        accessSecret: 'BADSECRET',
        hash: signedValues.hash,
        rts: signedValues.timestamp,
      },
    )
    expect(result).to.eql({ message: 'acsignature_hashMismatch', status: 401 })
    return done()
  })

  it('Error with wrong path', (done) => {
    let signedValues = acsignature.sign({ accessSecret, path: '/v1/me' }, { version: 4 })

    let result = acsignature.checkSignedPayload(
      {},
      {
        path: '/v1/user/3456',
        accessSecret,
        hash: signedValues.hash,
        rts: signedValues.timestamp,
      },
    )
    expect(result).to.eql({ message: 'acsignature_hashMismatch', status: 401 })
    return done()
  })

  it('Check with payload', (done) => {
    let payload = {
      key1: true,
      key2: 'is a string',
      key3: ['arrayValue1', 'arrayValue2'],
      key4: {
        isEnabled: true,
      },
    }
    let signedValues = acsignature.sign({ accessSecret, payload, path: '/v5/datastuff' }, { version: 4 })

    let result = acsignature.checkSignedPayload(payload, {
      path: '/v5/datastuff',
      accessSecret,
      hash: signedValues.hash,
      rts: signedValues.timestamp,
    })
    expect(result).to.be.undefined
    return done()
  })

  it('Check with nested payload and path', (done) => {
    let payload = {
      key2: 'is a string',
      key1: { xtreme: 'foo', tags: [{ tagId: 123, flag: 0 }, { tagId: 124, flag: 1 }, null, {}] },
      key4: {
        isFoo: false,
        isEnabled: true,
      },
      key3: ['arrayValue1', 'arrayValue2'],
    }
    let payload2 = {
      // == payload (but nested keys are reordered)
      key2: 'is a string',
      key1: { xtreme: 'foo', tags: [{ flag: 0, tagId: 123 }, { flag: 1, tagId: 124 }, null, {}] },
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
    let signedValues = acsignature.sign(params, { version: 4 })

    let options = {
      path: '/v1/apiendpoint',
      accessSecret,
      hash: signedValues.hash,
      rts: signedValues.timestamp,
    }
    let result = acsignature.checkSignedPayload(payload2, options)
    expect(result).to.be.undefined
    return done()
  })

  it('Check with nested payload containing same prop with different chars and path', (done) => {
    let payload = {
      filename: 'filename in small letters',
      fileName: 'filename in uppercas letters',
      key2: 'is a string',
      key1: { xtreme: 'foo', tags: [{ tagId: 123, flag: 0 }, { tagId: 124, flag: 1 }, null, {}] },
      key4: {
        isFoo: false,
        isEnabled: true,
      },
      key3: ['arrayValue1', 'arrayValue2'],
    }
    let payload2 = {
      // == payload (but nested keys are reordered)
      fileName: 'filename in uppercas letters',
      filename: 'filename in small letters',
      key2: 'is a string',
      key1: { xtreme: 'foo', tags: [{ flag: 0, tagId: 123 }, { flag: 1, tagId: 124 }, null, {}] },
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
    let signedValues = acsignature.sign(params, { version: 4 })

    let options = {
      path: '/v1/apiendpoint',
      accessSecret,
      hash: signedValues.hash,
      rts: signedValues.timestamp,
    }
    let result = acsignature.checkSignedPayload(payload2, options)
    expect(result).to.be.undefined
    return done()
  })
})
