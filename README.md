# ac-signature

This module helps you to sign request for the AdmiralCloud API

```
const acsignature = require('ac-signature');
```

## Prerequisites
You need to provide the following parameters for this function:

accessSecret
AccessKey and AccessSecret for your user in AdmiralCloud. Please contact support@admiralcloud.com for this information.

controller
The controller you are requesting. Please see API documentation

action
The action you are requesting. Please see API documentation.

payload
The actual payload you want to send to the API.

# Examples
For the following examples, we assume, that your accessKey "AKAC12344321" and you accessSecret is "my-very-good-accessSecret".


```
// Example 1: Retrieve information about user 123
// Token based request would be GET /user/123?token=xxx

const acsignature = require('ac-signature');

const params = {
  accessSecret: 'my-very-good-accessSecret',
  controller: 'user',
  action: 'find',
  payload: {"id": 123}

const signedValues = acsignature(params)

// The request then should look like this (using superagent - npm i superagent - for the request)
const request = require('superagent')

request
  .get('https://api.admiralcloud.com/v3/user/123')
  .set({
    'x-admiralcloud-accesskey': 'AKAC12344321',
    'x-admiralcloud-rts':       signedValues.timestamp,
    'x-admiralcloud-hash':      signedValues.hash,
  })
  .on('error', function(err) {
  .end((err, res) => {
    // res.body contains the response object
  });

```

```
// Example 2: Search request
// Token based request would be POST /search?token=xxx

const acsignature = require('ac-signature');

const params = {
  accessSecret: 'my-very-good-accessSecret',
  controller: 'search',
  action: 'search',
  payload: {
    "searchTerm": "My search term"
  }

const signedValues = acsignature(params)

// The request then should look like this (using superagent - npm i superagent - for the request)
const request = require('superagent')

request
  .post('https://api.admiralcloud.com/v3/search')
  .send(params.payload)
  .set({
    'x-admiralcloud-accesskey': 'AKAC12344321',
    'x-admiralcloud-rts':       signedValues.timestamp,
    'x-admiralcloud-hash':      signedValues.hash,
  })
  .on('error', function(err) {
  .end((err, res) => {
    // res.body contains the response object
  });

```


# Run tests
Prepare a config file in test directory with the following content
```
module.exports = {
  userId: yourUserId,
  customerId: yourCustomerId,
  accessKey: 'yourAPIuserAccessKey',
  accessSecret: 'yourAPIuserAccessSecret',
  baseUrl: 'https://api.admiralcloud.com' // optional - https://api.admiralcloud.com is already default
}

```

After that you can run "npm run test" or "npm run test-jenkins".
