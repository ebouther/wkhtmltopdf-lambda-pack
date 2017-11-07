'use strict';

const execSync = require('child_process').execSync;
const execFile = require('child_process').execFile;
const WKHTMLTOPDF_PATH = '/tmp/wkhtmltopdf';
const util = require('util');

const pack = exports = module.exports = {};

pack.state = [];

pack.packPack = (message) => {
    pack.state += ' \n' + message;
    console.log('pack:' + message)
};

pack.isAWSHosted = () => {
    const functionName = process.env.AWS_LAMBDA_FUNCTION_NAME || undefined;

    return functionName !== undefined;
};

const shellSync = (command, cwd) => {
    console.log('shellSync:', command);

    const options = {};
    const env = process.env;
    env.npm_config_cache ='/tmp/.npm';
    options.cwd = cwd;
    options.env = env;

    return execSync(command, options).toString();
};

pack.installWkHtmlToPdf = () => {
    pack.packPack("Install wkhtmltopdf Called");
    if(pack.isAWSHosted()) {
        pack.packPack("Install WKHTMLTOPDF Called: IS HOSTED");
        const mkdirOut = shellSync(`mkdir -p ${WKHTMLTOPDF_PATH}`);
        pack.packPack(`mkdirOut: ${mkdirOut}`);

        const mkdir2Out = shellSync(`mkdir -p /tmp/.npm`);
        pack.packPack(`mkdir2Out: ${mkdir2Out}`);

        try {
            const install = shellSync(`/usr/bin/curl -sL 'https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.4/wkhtmltox-0.12.4_linux-generic-amd64.tar.xz' | tar xJ`, WKHTMLTOPDF_PATH);
            pack.packPack(`...download and untar wkhtmltopdf...`);
        }
        catch(e) {
            pack.packPack(`download error: ${e}`);
        }


    }
    else {
        console.log('Its not hosted at AWS');
    }
};

pack.path = getBinPath();

pack.exec = function(args, onComplete) {

    console.log('exec wkhtmltopdf: ', args);

    if (!util.isArray(args)) {
        args = [ args ];
    }

    const wkhtmltopdfPath = getBinPath();
    return execFile(wkhtmltopdfPath, args, onComplete);

};

function getBinPath() {

    if(pack.isAWSHosted()) {
        return '/tmp/wkhtmltopdf/wkhtmltox/bin/wkhtmltopdf';
    }

    return 'wkhtmltopdf';

}

pack.installWkHtmlToPdf();
