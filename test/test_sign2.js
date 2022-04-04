const expect = require('expect');
const acsignature = require('../index');

describe('Test signature format v2', function () {
  const accessSecret = Math.random().toString('36');

  it('Check with empty payload', (done) => {
    let signedValues = acsignature.sign2({ accessSecret, path: '/v5/user/me' });

    let result = acsignature.checkSignedPayload(
      {},
      {
        path: '/v5/user/me',
        accessSecret,
        hash: signedValues.hash,
        rts: signedValues.timestamp,
      },
    );
    expect(result).toBeUndefined();
    return done();
  });

  it('Check with GET param and no payload', (done) => {
    let signedValues = acsignature.sign2({ accessSecret, path: '/v5/user/45345' });

    let result = acsignature.checkSignedPayload(
      {},
      {
        path: '/v5/user/45345',
        accessSecret,
        hash: signedValues.hash,
        rts: signedValues.timestamp,
      },
    );

    expect(result).toBeUndefined();
    return done();
  });

  it('Send wrong hash', (done) => {
    let signedValues = acsignature.sign2({ accessSecret, path: '/v5/user/me' });

    let result = acsignature.checkSignedPayload(
      {},
      {
        path: '/v5/user/me',
        accessSecret,
        hash: 'BADHASH',
        rts: signedValues.timestamp,
      },
    );
    expect(result).toEqual({ message: 'acsignature_hashMismatch', status: 401 });
    return done();
  });

  it('Error for wrong timestamp', (done) => {
    let signedValues = acsignature.sign2({ accessSecret, path: '/v5/user/me' });

    const timestamp = Date.now() / 1000 + 100;
    let result = acsignature.checkSignedPayload(
      {},
      {
        path: '/v5/user/me',
        accessSecret,
        hash: signedValues.hash,
        rts: timestamp,
      },
    );

    expect(result).toEqual({
      message: 'acsignature_rtsDeviation',
      status: 401,

      additionalInfo: {
        deviation: 10,
        ts: Math.floor(timestamp),
      },
    });
    return done();
  });

  it('Error with wrong accessSecret', (done) => {
    let signedValues = acsignature.sign2({ accessSecret, path: '/v5/user/me' });

    let result = acsignature.checkSignedPayload(
      {},
      {
        path: '/v5/user/me',
        accessSecret: 'BADSECRET',
        hash: signedValues.hash,
        rts: signedValues.timestamp,
      },
    );
    expect(result).toEqual({ message: 'acsignature_hashMismatch', status: 401 });
    return done();
  });

  it('Error with wrong path', (done) => {
    let signedValues = acsignature.sign2({ accessSecret, path: '/v5/user/me' });

    let result = acsignature.checkSignedPayload(
      {},
      {
        path: '/v5/user/3456',
        accessSecret,
        hash: signedValues.hash,
        rts: signedValues.timestamp,
      },
    );
    expect(result).toEqual({ message: 'acsignature_hashMismatch', status: 401 });
    return done();
  });

  it('Check with payload', (done) => {
    let payload = {
      key1: true,
      key2: 'is a string',
      key3: ['arrayValue1', 'arrayValue2'],
      key4: {
        isEnabled: true,
      },
    };
    let signedValues = acsignature.sign2({ accessSecret, payload, path: '/v5/datastuff' });

    let result = acsignature.checkSignedPayload(payload, {
      path: '/v5/datastuff',
      accessSecret,
      hash: signedValues.hash,
      rts: signedValues.timestamp,
    });
    expect(result).toBeUndefined();
    return done();
  });
});
