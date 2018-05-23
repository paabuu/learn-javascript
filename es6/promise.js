// 依据Promises/A+规范实现promise

class Promise {
    constructor(executor) {
        this.status = 'pending';
        this.result = null;
        this.reason = null;
        this.resolveHandler = [];
        this.rejectHandler = [];

        const resolve = (val) => {
            setTimeout(() => {
                if (this.status === 'pending') {
                    this.status = 'resolved';
                    this.result = val;

                    for (let resolve of this.resolveHandler) {
                        resolve(val);
                    }
                }
            });
        }

        const reject = (reason) => {
            setTimeout(() => {
                if (this.status === 'pending') {
                    this.status = 'rejected';
                    this.reason = reason;

                    for (let reject of this.rejectHandler) {
                        reject(reason);
                    }
                }
            });
        }

        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e)
        }
    }

    static solvePromise(promise2, x, resolve, reject) {
        if (x === promise2) {
            return reject(new TypeError('promise与x为同一对象!'));
        }

        // 如果onFulfilled返回了一个promise，此时promise2要接受这个promise的状态
        if (x instanceof Promise) {
            if (x.status === 'pending') {
                x.then(value => Promise.solvePromise(promise2, value, resolve, reject));
            } else {
                x.then(resolve, reject);
            }
            return;
        }

        // 如果x是对象或者函数
        // 为了与其他的promise实现进行兼容
        let then;
        let hasResolveOrReject = false
        if (x !== null && (typeof x === 'function' || typeof x === 'object')) {

            try {
                then = x.then;
            } catch(e) {
                return reject(e);
            }

            if (typeof then === 'function') {
                try {
                    then.call(x, function solvePromise(y) {
                        if (hasResolveOrReject) return;
                        hasResolveOrReject = true;

                        Promise.solvePromise(promise2, y, resolve, reject);
                    }, function reject(r) {
                        if (hasResolveOrReject) return;
                        hasResolveOrReject = true;

                        reject(r);
                    });
                } catch (e) {
                    if (hasResolveOrReject) return;
                    reject(e);
                }
            } else {
                resolve(x);
            }

        } else {
            resolve(x);
        }
    }

    then(onFullfilled, onRejected) {
        onFullfilled = typeof onFullfilled === 'function' ? onFullfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : value => value;

        let promise2;

        switch(this.status) {
            case 'pending':
                return promise2 = new Promise((resolve, reject) => {
                    this.resolveHandler.push(() => {
                        try {
                            const x = onFullfilled(this.result);

                            Promise.solvePromise(promise2, x, resolve, reject);
                        } catch (err) {
                            reject(err);
                        }
                    });

                    this.rejectHandler.push(() => {
                        return promise2 = new Promise((resolve, reject) => {
                            try {
                                const x = onRejected(this.reason);

                                Promise.solvePromise(promise, x, resolve, reject);
                            } catch (err) {
                                reject(err);
                            }
                        });
                    });
                });

            // 如果onFullfilled是个异步函数而this.resolve已经调用，那么此时状态就会变为resolved
            case 'resolved':
                setTimeout(() => {
                    return promise2 = new Promise((resolve, reject) => {
                        try {
                            const x = onFullfilled(this.result);

                            Promise.solvePromise(promise2, x, resolve, reject);
                        } catch (err) {
                            reject(err);
                        }
                    });
                });

            case 'rejected':
                setTimeout(() => {
                    return promise2 = new Promise((resolve, reject) => {
                        try {
                            const x = onRejected(this.reason);

                            Promise.solvePromise(promise, x, resolve, reject);
                        } catch (err) {
                            reject(err);
                        }
                    });
                });
        }
    }
}

exports.MyPromise = Promise;
