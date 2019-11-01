# ac-signature

This module helps you to sign request for the AdmiralCloud media asset management.
https://www.admiralcloud.com

## Usage

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


## Sign a request
```
// Example 1: Retrieve information about user 123
// Token based request would be GET /user/123?token=xxx

const acsignature = require('ac-signature');

const params = {
  accessSecret: 'my-very-good-accessSecret',
  controller: 'user',
  action: 'find',
  payload: {"id": 123}

const signedValues = acsignature.sign(params)

// The request then should look like this (using superagent - yarn add superagent - for the request)
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

const signedValues = acsignature.sign(params)

// The request then should look like this (using superagent - yarn add superagent - for the request)
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

## Check a hashed request
If you want to check an incoming request, you can now also use this class.

```
// Example: check hashed payload
const acsignature = require('ac-signature');

// this is the request payload (make sure to have all parameters from body, URL, etc in one object)
let payload = {
  searchTerm: "My search term"
}

// headers from request
let headers = {
  'x-admiralcloud-accesskey': 'AKAC12344321',
  'x-admiralcloud-rts':       1572628136,
  'x-admiralcloud-hash':      'ab124fjagd...xxxx',
  'x-admiralcloud-debugsignature': true // optional
}

let options = {
  headers, 
  controller: 'search',
  action: 'search',
  method: 'post, // req.method
  accessSecret: 'my-very-good-accessSecret'
}

let result = acsignature.checkSignedPayload(payload, options)
// -> result is empty if payload is ok, otherwise result contains an error message
```


# Links
- [Website](https://www.admiralcloud.com/)
- [Twitter (@admiralcloud)](https://twitter.com/admiralcloud)
- [Facebook](https://www.facebook.com/MediaAssetManagement/)

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

After that you can run "yarn run test" or "yarn run test-jenkins".

## License

[MIT License](https://opensource.org/licenses/MIT) Copyright © 2009-present, AdmiralCloud, Mark Poepping