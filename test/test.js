const _ = require('lodash')

const fs = require('fs')
const path = require('path')

const configFile = path.join(__dirname, '/config.js')
if (!fs.existsSync(configFile)) {
  throw 'configFileMissing'
}

// If true, only "localTest" will be executed - use npm run test-local
const testMode = _.get(process, 'env.TESTMODE', false)

global.config = require(configFile)

const suite = {
  1: require('./suites/default')
}

if (testMode) {
  _.set(suite, 2, require('./suites/localTest'))
}

if (testMode) suite[2].testsuite()
else suite[1].testsuite()
