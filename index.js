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
    Object.keys(options).forEach((k) => {
        if(k != "format") {
            if(k.length == 1) {
                args.push("-" + k)
                args.push(options[k])
            }
            else {
                args.push("--" + k)
                args.push(options[k])
            }
        }
    })
    let scanimage = processes.spawn('scanimage', args);
    return scanimage.stdout;
}

var parseOpts = (txt) => {
    var lines = txt.split("\n")
    var regline = /\s+--([a-zA-Z]+)\s(.+)\s\[(.*)\]/
    let opt = null
    let opts = []
    lines.forEach(element => {
        let res = /\s+-+(\S+)\s(-*\d+)\.+(\S+)\s\[(.*)\]/.exec(element)
        if(res) {
            if(opt) opts.push(opt)
            opt = {
                name: res[1],
                min: parseFloat(res[2]),
                max: parseFloat(res[3]),
                default: res[4],
                description: ""
            }
        }
        else {
            res = regline.exec(element)
            if(res) {
                if(opt) opts.push(opt)
                opt = {
                    name: res[1],
                    select: res[2].split("|"),
                    default: res[3],
                    description: ""
                }
            }
            else {
                res = /\s+--.*/.exec(element) 
                if(res) {
                    if(opt) opts.push(opt)
                    opt = null
                }
                else
                    if(opt) opt.description += element
            }
        }
    });

    return opts
}

Scanner.prototype.infos = function() {
    return new Promise((resolve, reject) => {
        let result = ""
        let scanimage = processes.spawn('scanimage', ["-A", "-d", this.device.name]);
        scanimage.stdout.once('error', l => console.log("Error"));
        scanimage.stdout.on('data',(chunk) => {
            result += chunk.toString();
        });
        scanimage.stdout.once('end', () => {
            resolve(parseOpts(result))
        })
    })
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