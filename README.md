# ac-signature

This module helps you to sign request for the AdmiralCloud API

```
const acsignature = require('ac-signature');
```

## api
You need to provide the following parameters for this function:

accessSecret
The accessSecret for your user in AdmiralCloud. Please contact support@admiralcloud.com for this information.

controller
The controller you are requesting. Please see API documentation

action
The action you are requesting. Please see API documentation.

payload
The actual payload you want to send to the API.

Example:
```
Request GET /user/123

controller: user
action: find
payload: {"id": 123}
```

You will receive a timestamp and a hash value. Send both values including your access keys as headers as described in the article linked below.

# More info
Please see our article TBC for more details on using our signing methods
