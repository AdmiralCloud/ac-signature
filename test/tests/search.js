const acsignature = require('../../index');
const should = require('should')
const request = require('superagent');
const _ = require('lodash')
const async = require('async')
const fs = require('fs')
const uuidV4 = require('uuid/v4')


const accessKey = _.get(config, 'accessKey')
const accessSecret = _.get(config, 'accessSecret')
const baseUrl = _.get(config, 'baseUrl', 'https://api.admiralcloud.com')
const testMode = _.startsWith(baseUrl, 'http')

module.exports = {

  basic: function() {

    let searchRequest =  {
      noAggregation: true,
      sourceFields: ['id', 'customerId'],
      from: 0,
      size: 100,
      preference: uuidV4(),
      debug: false,
      query: { 
        bool:{}
      },
      sort: [
        { '_score': 'desc' },
        { id: 'desc' }
      ],
      searchTerm: 'Behälter', // 'wino', 'hfasjkhfasdjkfhd', //
      field: 'tags',
      //minScore: 0,
      //basicSearch: false
    }

    let expectedSize = 0
    let responseSize = 0
    let responseItems = []
    let iteration = 1

    let last

    describe('Testing Search response', function() {
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
/*
      it('Search for tag', (done) => {
        let params       = {
          accessSecret: accessSecret,
          controller:   'search',
          action:       'search',
          payload:      searchRequest
        }
        let signedValues = acsignature.sign(params)

        //console.log(78, params.payload.search_after)
        request
          .post(baseUrl + '/v5/search')
          .send(params.payload)
          .set({
            'x-admiralcloud-accesskey': accessKey,
            'x-admiralcloud-rts':       signedValues.timestamp,
            'x-admiralcloud-hash':      signedValues.hash,
            'x-admiralcloud-test':      testMode
          })
          .on('error', (err) => {
            console.error(_.get(err, 'response.body'))
          })
          .end((err, res) => {
            if(err) return done(err)

            responseSize = _.size(res.body.hits.hits)
            expectedSize = res.body.hits.totalHits
            responseItems = _.concat(responseItems, _.map(res.body.hits.hits, '_id'))
            console.log('D FIRST', _.first(res.body.hits.hits))
            last = _.last(res.body.hits.hits)
            console.log('D LAST', last)
            return done()
          })
      })
      */

      it('Search for tag until end', (done) => {
        async.whilst(
          (wcb) => {
            return wcb(null, iteration === 1 || responseSize)
          },
          (callback) => {
            searchRequest.from += responseSize
            //if (last) searchRequest.searchAfter = _.get(last, 'sort')
            let params       = {
              accessSecret: accessSecret,
              controller:   'search',
              action:       'search',
              payload:      searchRequest
            }
            let signedValues = acsignature.sign(params)
            console.log(_.repeat('-', 80))
            console.log('PAYOLAD', params.payload)
            request
              .post(baseUrl + '/v6/search')
              .send(params.payload)
              .set({
                'x-admiralcloud-accesskey': accessKey,
                'x-admiralcloud-rts':       signedValues.timestamp,
                'x-admiralcloud-hash':      signedValues.hash,
                'x-admiralcloud-test':      testMode
              })
              .on('error', (err) => {
                console.error(_.get(err, 'response.body'))
              })
              .end((err, res) => {
                if(err) return callback(err)
                expectedSize = res.body.hits.totalHits
                iteration += 1


                responseSize = _.size(res.body.hits.hits)
                let response = _.map(res.body.hits.hits, item => {
                  let id = parseInt(_.get(item, '_id'))
                  let score = _.get(item, '_score')
                  console.log('MC  %s | Score %s', _.pad(id, 6), score)
                  let test = _.find(responseItems, { id })
                  if (test) {
                    console.log('Dup %s | Score %s', _.pad(_.get(test, 'id'), 6), _.get(test, 'score'))
                    /*
                    _.forEach(item._explanation.details, d => {
                      console.log(d)
                      console.log(d.details)
                    })
                    */
                  }
                  console.log(_.repeat('-', 80))
                  return { id, score }
                })      
                responseItems = _.concat(responseItems, response)
                //console.log(160, responseItems)

//                console.log(138, searchRequest.from, res.body.hits.totalHits)
                let first = _.first(res.body.hits.hits)
                last = _.last(res.body.hits.hits)
                console.log('FIRST ', _.get(first, '_id'), _.get(first, '_score'))
                console.log('LAST  ', _.get(last, '_id'), _.get(last, '_score'))

                if (res.body.hits.totalHits === _.size(responseItems)) {
                  // all fetched
                  responseSize = 0
                }
                console.log('')
                console.log('')
                console.log('')
                return callback()
              })              
          }, done)
      })

      it('How many items', done => {
        //console.log(170, responseItems)
        console.log('Expected ', expectedSize)
        console.log('Received items', _.size(responseItems))
        let uniq = _.uniq(responseItems)
        console.log('Unique items', _.size(uniq))
        console.log('Received items', _.size(responseItems))

        fs.writeFile('./items.txt', _.map(responseItems.sort(), item =>  { return parseInt(item).toString() + '\n' }), done)
      })

    })
  }
}
