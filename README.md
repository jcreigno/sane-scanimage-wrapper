# sane-scanimage-wrapper
simple wrapper around sane scanimage to scan images from node

### Requirements

This module is a wrapper around sane's `scanimage` utility, you need to have sane installed.

### Install

```sh
npm install --save sane-scanimage-wrapper
```


### API

#### listDevices

Returns a promise that is resolved to an Array of available devices.

Example: 

```js

var sane = require('sane-scanimage-wrapper');

sane.listDevices().then(console.log);

/* output :
[ { name: 'epson2:net:192.168.0.38',
    vendor: 'Epson',
    model: 'PID 0891',
    type: 'flatbed scanner',
    index: '0' } ]
*/
```

#### Scan 

Return a stream of the scaned image.

```js
var sane = require('sane-scanimage-wrapper');
var fs = require('fs');

var scanner = new sane.Scanner();
scanner.scan().pipe(fs.createWriteStream('./output.png'));

```

