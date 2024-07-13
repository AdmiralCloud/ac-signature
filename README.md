# ac-signature

This module helps you to sign request for the AdmiralCloud media asset management.
https://www.admiralcloud.com

Please note, that every signed payload is only valid for 10 seconds by default. The same is true for time deviation (+/- 10 seconds), so make sure your computer's time is in sync/valid. You can set the deviation with a custom value using options

### Breaking changes version 2.x
Starting with version 2 (package.json) now has the function to sign the payload as well as to check the payload. So instead of acsignature(...) use acsignature.sign(...)

Please do not confuse package version 2 with signature version 2!

## Usage

```
const acsignature = require('ac-signature');
```

## Prerequisites
You need to provide the following parameters for this function:

accessSecret
AccessKey and AccessSecret for your user in AdmiralCloud. Please contact support@admiralcloud.com for this information.

payload
The actual payload you want to send to the API. Send an empty object in case you have no payload (e.g. GET requests)

When using signature version 5 (recommended), you only need the path. When working with version 1, you need controller and action (see below). Please note that signature version has nothing to do with the package version of ac-signature.

controller
The controller you are requesting. Please see API documentation

action
The action you are requesting. Please see API documentation.

path
Use the path instead of controller/action. You have to use signature version 2+. 

# Signature versions
First of all: Please do not confuse package version (e.g. 2) with signature version (e.g.2)!

Signature version 1 uses controller and action while signature version 2 and higher uses path. Signature version 3 fixes an issue with deep nested objects but has a breaking change in sorting the keys (which affects the hash).

Version 5 (recommended) is even more secure than version 3 when making calls with x-admiralcloud-identifier header.

Different signature versions are NOT compatible. Please make sure you use the same one on both sides!

You can tell the decoder (our API) which version to use by sending header x-admiralcloud-version

# Examples signature version 5 (recommended)
For the following examples, we assume, that your accessKey "AKAC12344321" and you accessSecret is "my-very-good-accessSecret".

```
// Example 1: Search request
// Token based request would be POST /search?token=xxx

const acsignature = require('ac-signature');

const params = {
  accessSecret: 'my-very-good-accessSecret',
  path: '/v5/search',
  payload: {
    "searchTerm": "My search term"
  },
  identifier: 'my-very-good-identifier'
}

const signedValues = acsignature.sign5(params)
const signedValues = acsignature.sign(params, { version: 5 })


// The request then should look like this (using superagent - yarn add superagent - for the request)
const request = require('superagent')

request
  .post('https://api.admiralcloud.com/v5/search')
  .send(params.payload)
  .set({
    'x-admiralcloud-accesskey': 'AKAC12344321',
    'x-admiralcloud-rts':       signedValues.timestamp,
    'x-admiralcloud-hash':      signedValues.hash,
    'x-admiralcloud-version':   5,
    'x-admiralcloud-identifier': 'my-very-good-identifier'
  })
  .on('error', function(err) {
  .end((err, res) => {
    // res.body contains the response object
  });

```


# Examples signature version 3
For the following examples, we assume, that your accessKey "AKAC12344321" and you accessSecret is "my-very-good-accessSecret".

## Sign a request (signature version 3, not version of this app)
```
// Example 1: Retrieve information about user 123
// Token based request would be GET /user/123

const acsignature = require('ac-signature');

const params = {
  accessSecret: 'my-very-good-accessSecret',
  path: '/v1/user/123'
}

const signedValues = acsignature.sign(params, { version: 3 })


// The request then should look like this (using superagent - yarn add superagent - for the request)
const request = require('superagent')

request
  .get('https://iam.admiralcloud.com/v1/user/123')
  .set({
    'x-admiralcloud-accesskey': 'AKAC12344321',
    'x-admiralcloud-rts':       signedValues.timestamp,
    'x-admiralcloud-hash':      signedValues.hash,
    'x-admiralcloud-version':   3
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
  path: '/v5/search',
  payload: {
    "searchTerm": "My search term"
  }

const signedValues = acsignature.sign(params, { version: 3 })


// The request then should look like this (using superagent - yarn add superagent - for the request)
const request = require('superagent')

request
  .post('https://api.admiralcloud.com/v5/search')
  .send(params.payload)
  .set({
    'x-admiralcloud-accesskey': 'AKAC12344321',
    'x-admiralcloud-rts':       signedValues.timestamp,
    'x-admiralcloud-hash':      signedValues.hash,
    'x-admiralcloud-version':   3
  })
  .on('error', function(err) {
  .end((err, res) => {
    // res.body contains the response object
  });

```

## Check a hashed request (version 2)
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
  'x-admiralcloud-version':   3 // optional, but recommended - required if you signed with version 3
  'x-admiralcloud-debugsignature': true // optional
}

let options = {
  headers, 
  path: '/v5/search',
  accessSecret: 'my-very-good-accessSecret'
}

let result = acsignature.checkSignedPayload(payload, options)
// -> result is empty if payload is ok, otherwise result contains an error message
```


# Examples V1 (deprecated)
For the following examples, we assume, that your accessKey "AKAC12344321" and you accessSecret is "my-very-good-accessSecret".


## Sign a request V1 (deprecated)
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
  .get('https://iam.admiralcloud.com/v1/user/123')
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
  .post('https://api.admiralcloud.com/v5/search')
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

# Options
Option | Type | Remarks
---|---|---|
deviation | number | Number in seconds, RTS/time deviation is allowed. If the timestamp is out of range, the request will fail


# Links
- [Website](https://www.admiralcloud.com/)

# Run tests
```
yarn run test
```

# AC License Report
|Stat|Value|
|---|---|
|Repository|ac-signature|
|Date|Sat Jul 13 2024 16:26:38 GMT+0200 (Mitteleuropäische Sommerzeit)|
|Total|8|
|Analyzed|8|

&nbsp;
### Licenses
|License|Count|Percent|Info|
|---|---|---|---|
|MIT|7|87.5|https://choosealicense.com/licenses/mit/|
|ISC|1|12.5||

&nbsp;
### Detailed Report
|License|Packages|
|---|---|
|MIT|ac-semantic-release, chai, eslint, lodash, mocha, mocha-junit-reporter, superagent|
|ISC|c8|

## License

[MIT License](https://opensource.org/licenses/MIT) Copyright © 2009-present, AdmiralCloud, Mark Poepping