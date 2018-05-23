const MyPromise = require('./promise').MyPromise;

const promise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(1);
    }, 1000);
});

promise.then((v) => {
    console.log(v);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('这是哈哈哈哈');
        });
    });
})
.then(console.log, console.log);
