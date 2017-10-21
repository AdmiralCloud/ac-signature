const acsignature = require('../index');
const request = require('superagent');
const _ = require('lodash')
const should = require('should')

const accessKey = _.get(process, 'env.ACCESSKEY')
const accessSecret = _.get(process, 'env.ACCESSSECRET')
const baseUrl = _.get(process, 'env.BASEURL', 'https://api.admiralcloud.com')
const testMode = _.startsWith(baseUrl, 'http')

describe('Testing API User', function () {
  this.timeout(60000)

  it('Get ME', function(done) {
    let params = {
      accessSecret: accessSecret,
      controller:   'user',
      action:       'mefind',
      payload: {}
    }
    let signedValues = acsignature(params)

    request
      .get(baseUrl + '/v2/user/me')
      .set({
        'x-admiralcloud-accesskey': accessKey,
        'x-admiralcloud-rts': signedValues.timestamp,
        'x-admiralcloud-hash': signedValues.hash,
        'x-admiralcloud-test': testMode
      })
      .on('error', function(err) {
        console.error(_.get(err, 'response.body'))
      })
      .end((err, res) => {
        if (err) return done(err)

        res.body.should.have.property('id')
        res.body.should.have.property('firstname')
        res.body.should.have.property('lastname')
        res.body.should.have.property('memberGroups')
        return done()
      });
  })

  it('Fetch mediacontainers of type video - using V2', function(done) {
    let params = {
      accessSecret: accessSecret,
      controller:   'mediacontainer',
      action:       'findbatch',
      payload: {
        type: ['video'],
        limit: 1
      }
    }
    let signedValues = acsignature(params)

    request
      .post(baseUrl + '/v2/mediacontainer/findBatch')
      .send(params.payload)
      .set({
        'x-admiralcloud-accesskey': accessKey,
        'x-admiralcloud-rts': signedValues.timestamp,
        'x-admiralcloud-hash': signedValues.hash,
        'x-admiralcloud-test': testMode
      })
      .on('error', function(err) {
        console.error(_.get(err, 'response.body'))
      })
      .end((err, res) => {
        if (err) return done(err)

        res.body.should.have.length(1)
        let test = _.first(res.body)
        test.should.have.property('id')
        test.should.have.property('flag', 0)
        test.should.have.property('audioLanguage')

        return done()
      });
  })

})
