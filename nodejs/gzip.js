const zlib = require('zlib');
const fs = require('fs');

const file = process.argv[2];

fs.createReadStream(file)
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream(file + '.gz'))
    .on('finish', () => console.log('File successful compressed'));
