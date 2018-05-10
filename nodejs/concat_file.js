const fromArray = require('from2-array');

const through = require('through2');

const fs = require('fs');

function concatFiles(destination, files, callback) {
    const destStream = fs.createWriteStream(destination);

    fromArray.obj(files)
             .pipe(through.obj((file, enc, done) => {
                 const src = fs.createReadStream(file);
                 src.pipe(destStream, { end: false });
                 src.on('end', done);
             }))
             .on('finish', () => {
                 destStream.end();

                 callback();
             })
}

concatFiles(process.argv[2], process.argv.slice(3), () => {
    console.log('Files concatenated successful!');
});
