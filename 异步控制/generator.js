function* fruitGenerator() {
    yield 'apple';
    yield 'orange';
    return 'watermelon';
}

// const fruit = fruitGenerator();
//
// console.log(fruit.next());
// console.log(fruit.next());
// console.log(fruit.next());

// function* iteratorGenerator(arr) {
//     for(var i = 0; i < arr.length; i++) {
//         yield arr[i];
//     }
// }
//
// const fruitIterator = iteratorGenerator(['apple', 'orange', 'watermelon']);
//
// let currentItem = fruitIterator.next();
// while (!currentItem.done) {
//     console.log(currentItem.value);
//     currentItem = fruitIterator.next();
// }

function asyncFlow(generatorFunc) {
    function callback(err) {
        if (err) {
            throw new Error(err);
        }

        const results = [].slice.call(arguments, 1);
        generator.next(results.length > 1 ? results : results[0]);
    }

    const generator = generatorFunc(callback);
    generator.next();
}

const fs = require('fs');
const path = require('path');

asyncFlow(function* (callback) {
    const filename = path.basename(__filename);
    const myself = yield fs.readFile(filename, 'utf8', callback);
    yield fs.writeFile(`clone_of_${ filename }`, myself, callback);
    console.log('finish clone!');
})
