const acsignature = require('../../index');
const should = require('should')
const request = require('superagent');
const _ = require('lodash')

const accessKey = _.get(config, 'extAuth.accessKey')
const accessSecret = _.get(config, 'extAuth.accessSecret')
const baseUrl = _.get(config, 'extAuth.baseUrl', 'https://api.admiralcloud.com')
const testMode = _.startsWith(baseUrl, 'http')

module.exports = {

  extAuth: function() {

    describe('Testing EXT AUTH - Mediahub', function() {
      this.timeout(60000)

      let extAuthToken

      it('Create token', function(done) {
        let params       = {
          accessSecret: accessSecret,
          controller:   'user',
          action:       'extAuth',
          payload:      {
            identifier: config.extAuth.identifier,
            type:       'mediahub'
          }
        }
        let signedValues = acsignature(params)

        request
          .post(baseUrl + '/v3/extAuth')
          .send(params.payload)
          .set({
            'x-admiralcloud-accesskey':      accessKey,
            'x-admiralcloud-rts':            signedValues.timestamp,
            'x-admiralcloud-hash':           signedValues.hash,
            'x-admiralcloud-test':           testMode,
            'x-admiralcloud-debugsignature': false
          })
          .on('error', function(err) {
            console.error(_.get(err, 'response.body'))
          })
          .end((err, res) => {
            if(err) return done(err)

            res.body.should.have.property('token')
            extAuthToken = res.body.token
            return done()
          });
      })

      it('Check auth', function(done) {

        request
          .get(baseUrl + '/v3/msc/auth')
          .set({
            'x-admiralcloud-auth':           extAuthToken,
            'x-admiralcloud-test':           testMode,
            'x-admiralcloud-debugsignature': false
          })
          .on('error', function(err) {
            console.error(_.get(err, 'response.body'))
          })
          .end((err, res) => {
            if(err) return done(err)

            res.body.should.have.property('ok', true)
            return done()
          });
      })

    })

  }
}
