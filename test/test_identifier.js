const { expect } = require('chai')
const acsignature = require('../index');

describe('Test signature with identifier (on behalf request) - requires version 5', function () {
  const accessSecret = Math.random().toString('36')

  it('Check with identifier', (done) => {
    let signedValues = acsignature.sign5({ accessSecret, path: '/v1/me', identifier: '123-456' });

    let result = acsignature.checkSignedPayload(
      {},
      {
        path: '/v1/me',
        accessSecret,
        hash: signedValues.hash,
        rts: signedValues.timestamp,
        identifier: '123-456',
        version: 5
      },
    );
    expect(result).to.be.undefined;
    return done();
  });

  it('Check with tampered identifier', (done) => {
    let signedValues = acsignature.sign5({ accessSecret, path: '/v1/me', identifier: '123-456' });

    let result = acsignature.checkSignedPayload(
      {},
      {
        path: '/v1/user/45345',
        accessSecret,
        hash: signedValues.hash,
        rts: signedValues.timestamp,
        identifier: '123-789',
        version: 5
      },
    );

    expect(result).to.eql({ message: 'acsignature_hashMismatch', status: 401 });
    return done();
  });

  it('Check without identifier - should fail', (done) => {
    let signedValues = acsignature.sign5({ accessSecret, path: '/v1/me', identifier: '123-456' });

    let result = acsignature.checkSignedPayload(
      {},
      {
        path: '/v1/user/45345',
        accessSecret,
        hash: signedValues.hash,
        rts: signedValues.timestamp,
        version: 5
      },
    );

    expect(result).to.eql({ message: 'acsignature_hashMismatch', status: 401 });
    return done();
  });
});
