// CURRENTL MISSING: Media, FTP CHeck, Replace Original

// require all tests
const tests = require('./../tests/index')
const timeOut = 60000

module.exports = {
  testsuite: function(user) {

    /*
    describe('BASIC', function () {
      this.timeout(timeOut)
      tests.basic.basic()
    })

    describe('EXT AUTH', function () {
      this.timeout(timeOut)
      tests.extAuth.extAuth()
    })
    */

    describe('SEARCH', function () {
      this.timeout(timeOut)
      tests.search.basic()
    })
  }
}
