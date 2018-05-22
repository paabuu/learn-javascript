// 依据Promises/A+规范实现promise

class Promise {
    constructor(executor) {
        this.status = 'pending';
        this.result = null;
        this.reason = null;
        this.resolveHandler = [];
        this.rejectHandle = [];

        this.resolve = this.resolve.bind(this);
        this.reject = this.reject.bind(this);

        executor(this.resolve, this.reject);
    }

    resolve(val) {
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

    reject(reason) {
        setTimeout(() => {
            if (this.status === 'pending') {
                this.status = 'rejected';
                this.reject = reason;

                for (let reject of this.rejectHandler) {
                    reject(reason);
                }
            }
        });
    }

    static solvePromise(promise2, x) {

    }

    then(onFullfilled, onRejected) {
        onFullfilled = typeof onFullfilled === 'function' ? onFullfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : value => value;

        let promise2;

        switch(this.status) {
            case 'pending':
                // return promise2 = new Promise((resolve, reject) => {
                //     this.resolveHandler.push(() => {
                //
                //     })
                // })

            // 如果onFullfilled是个异步函数而this.resolve已经调用，那么此时状态就会变为resolved
            case 'resolved':
                return promise2 = new Promise((resolve, reject) => {
                    try {
                        var x = onFullfilled(this.result);

                        Promise.resolvePromise(promise2, x);
                    } catch (err) {
                        reject(err);
                    }
                });
        }
    }
}
