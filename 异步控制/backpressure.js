const Chance = require('chance');
const chance = new Chance();

require('http').createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});

    function generateMore() {
        while(chance.bool({likelihood: 95})) {
            let shouldContinue = res.write(
                chance.string({ length: (16 * 1024) - 1 })
            )

            if (!shouldContinue) {
                console.log('\nback pressure\n');
                return res.once('drain', generateMore);
            }
        }
    }

    generateMore();

    res.end('\nThe End\n');
}).listen(8080);
