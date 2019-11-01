const acsignature = require('../../index');
const should = require('should')
const request = require('superagent');
const _ = require('lodash')


const accessKey = _.get(config, 'accessKey')
const accessSecret = _.get(config, 'accessSecret')
const baseUrl = _.get(config, 'baseUrl', 'https://api.admiralcloud.com')
const testMode = _.startsWith(baseUrl, 'http')

module.exports = {

  basic: function() {
    describe('Testing API User', function() {
      this.timeout(60000)

      it('Get ME', function(done) {
        let params       = {
          accessSecret: accessSecret,
          controller:   'user',
          action:       'mefind',
          payload:      {}
        }
        let signedValues = acsignature.sign(params)

        request
          .get(baseUrl + '/v5/user/me')
          .set({
            'x-admiralcloud-accesskey': accessKey,
            'x-admiralcloud-rts':       signedValues.timestamp,
            'x-admiralcloud-hash':      signedValues.hash,
            'x-admiralcloud-test':      testMode
          })
          .on('error', function(err) {
            console.error(_.get(err, 'response.body'))
          })
          .end((err, res) => {
            if(err) return done(err)

            res.body.should.have.property('id', _.get(config, 'userId'))
            res.body.should.have.property('customerId', _.get(config, 'customerId'))
            res.body.should.have.property('firstname')
            res.body.should.have.property('lastname')
            res.body.should.have.property('memberGroups')
            return done()
          });
      })

      it('Fetch mediacontainers of type video - using V2', function(done) {
        let params       = {
          accessSecret: accessSecret,
          controller:   'mediacontainer',
          action:       'findbatch',
          payload:      {
            type:  ['video'],
            limit: 1
          }
        }
        let signedValues = acsignature.sign(params)

        request
          .post(baseUrl + '/v5/mediacontainer/findBatch')
          .send(params.payload)
          .set({
            'x-admiralcloud-accesskey': accessKey,
            'x-admiralcloud-rts':       signedValues.timestamp,
            'x-admiralcloud-hash':      signedValues.hash,
            'x-admiralcloud-test':      testMode
          })
          .on('error', function(err) {
            console.error(_.get(err, 'response.body'))
          })
          .end((err, res) => {
            if(err) return done(err)

            res.body.should.have.length(1)
            let test = _.first(res.body)
            test.should.have.property('id')
            test.should.have.property('flag', 0)
            test.should.have.property('audioLanguage')
            test.should.have.property('type', 'video')
            return done()
          });
      })

    })
  }
}
