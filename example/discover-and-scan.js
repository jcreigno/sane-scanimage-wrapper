
const scanners = require('../index'), fs = require('fs');

scanners.listDevices().then((devices) => {
  if(devices.length==0){
    console.log('no device available');
  }
  let scanner = new scanners.Scanner(devices[0]);
  scanner.scan().pipe(fs.createWriteStream('./output.png'));
});
