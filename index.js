const processes = require('child_process');

function Scanner(device) {
    this.device = device;
}

function addOptions(args, opts) {
    return Object.keys(opts).reduce(function (prev, curr) {
        prev.push('--' + curr + '=' + opts[curr]);
        return prev;
    }, args);
}

Scanner.prototype.scan = function(options) {
    let opts = Object.assign({}, { format: 'png'},  options);
    let args = [];
    if (this.device) {
        opts.device = this.device.name;
    }
    addOptions(args, opts);
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