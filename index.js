const processes = require('child_process');

function Scanner(device) {
    this.device = device;
}

Scanner.prototype.scan = function(options) {
    let opts = options || {};
    let format = opts.format || 'png';
    let args = ['--format=' + format];
    if (this.device) {
        args.push('--device-name=' + this.device.name);
    }
    let scanimage = processes.spawn('scanimage', args);
    return scanimage.stdout;
}

module.exports = {
    listDevices : () => {
        return new Promise((resolve, reject) => {
            let result = '';
            let scanimage = processes.spawn('scanimage', ['--formatted-device-list={"name":"%d", "vendor":"%v","model":"%m","type":"%t","index":"%i"}%n']);
            scanimage.stdout.once('error', reject);
            scanimage.stdout.on('data', (chunk) => {
                result += chunk.toString();
            });
            scanimage.stdout.once('end', () => {
                if (!result) {
                    return resolve([]);
                }
                return resolve(result.split('\n').filter(Boolean).map(line => JSON.parse(line)));
            });
        });
    },
    Scanner: Scanner
};