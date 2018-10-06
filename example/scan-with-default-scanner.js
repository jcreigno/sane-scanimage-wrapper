
const sane = require('../index'), fs = require('fs');
let scanner = new sane.Scanner();
scanner.scan().pipe(fs.createWriteStream('./output.png'));
