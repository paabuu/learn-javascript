const { promisify } = require('./utilities');
const request = promisify(require('request'));
const mkdirp = promisify(require('mkdirp'));
const fs = require('fs');
const path = require('path');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const download_web = (url, filename) => {
    let body;
    request(url)
        .then(response => {
            body = response.body;
            return mkdirp(path.dirname(filename))
        })
        .then(() => writeFile(filename, body))
        .then(() => console.log('下载完成!'))
};

// download_web('http://www.baidu.com', '百度一下');
download_web('http://ohippo.com', 'ohippo');
