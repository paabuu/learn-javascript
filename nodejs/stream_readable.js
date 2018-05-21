// process.stdin
//     .on('data', chunk => {
//         console.log('New Data Available');
//         console.log(`Chunk read: (${ chunk.length}) ${ chunk.toString() }`);
//     })
//     .on('end', () => process.stdout.write('End of stream'))
const stream = require('stream');
const Chance = require('chance');

const chance = new Chance();

class RandomStream extends stream.Readable {
    constructor(option) {
        super(option);
    }

    _read(size) {
        const chunk = chance.string();
        this.push(chunk, 'utf8');

        // if (chance.bool({ likelihood: 5})) {
        //     this.push(null);
        // }
    }
}

const randomStream = new RandomStream();

randomStream.on('readable', () => {
    let chunk;

    while((chunk = randomStream.read()) !== null) {
        console.log(chunk.toString());
    }
});
