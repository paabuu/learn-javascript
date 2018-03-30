class MyPromise {
    constructor(fn) {
        this.state = 'pending';
        this.result = null;
        this.reason = null;
        this.resolveHandler = [];
        this.rejectHandler = [];
        this.resolve = this.resolve.bind(this);
        this.reject = this.reject.bind(this);
        
        fn(this.resolve, this.reject);
    }

    resolve(val) {
        if (this.state === 'pending') {
            this.state = 'resolved';
            this.result = val;
            
            for (var i = 0; i < this.resolveHandler.length; i++) {
                this.resolveHandler[i](val);
            }
        }
    }

    reject(err) {
        if (this.state === 'pending') {
            this.state = 'rejected';
            this.reason = err;
            
            for (var i = 0; i < this.rejectHandler.length; i++) {
                this.rejectHandler[i](err);
            }
        }
    }

    static resolveMyPromise(MyPromise2, x, resolve, reject) {
        let then;

        if (MyPromise2 === x) {
            return reject(new TypeError('chaining cycle detected for MyPromise!'));
        }

        if (x instanceof MyPromise) {
            if (x.state === 'pending') {
                x.then(value => MyPromise.resolveMyPromise(MyPromise, value, resolve, reject), reject);
            } else {
                x.then(resolve, reject);
            }

            return;
        }

        if (x !== null && (typeof x === 'function' || typeof x === 'object')) {
            try {
                then = x.then;
                if (typeof then === 'function') {
                    then.call(x, function resolveMyPromise(y) {
                        return MyPromise.resolveMyPromise(MyPromise2, y, resolve, reject);
                    }, function rejectMyPromise(r) {
                        reject(r);
                    })                    
                } else {
                    resolve(x);
                }
            } catch (err) {
                reject(err);
            }
        } else {
            resolve(x);
        }
    }

    then(resolveHandler, rejectHandler) {
        resolveHandler = typeof resolveHandler === 'function' ? resolveHandler : function(value) { return value; };
        rejectHandler = typeof rejectHandler === 'function' ? rejectHandler : function(err) { return err };
        
        let MyPromise2;
        console.log(this.state);
        switch (this.state) {
            case 'pending':
                return MyPromise2 = new MyPromise((resolve, reject) => {
                    this.resolveHandler.push(() => {
                        try {
                            var x = resolveHandler(this.result);
                            
                            MyPromise.resolveMyPromise(MyPromise2, x, resolve, reject);
                        } catch(err) {
                            reject(err);
                        }
                    });

                    this.rejectHandler.push(() => {
                        try {
                            var x = rejectHandler(this.reason);

                            MyPromise.resolveMyPromise(MyPromise2, x, resolve, reject);
                        } catch(err) {
                            reject(err);
                        }
                    });
                });
                break;
            case 'resolved':
                return new MyPromise((resolve, reject) => {
                    var x = resolveHandler(this.result);
                    MyPromise.resolveMyPromise(MyPromise2, x, resolve, reject);
                });
                break;
            case 'rejected':
                var x = rejectHandler(this.reason);
                MyPromise.resolveMyPromise(MyPromise2, x, resolve, reject);
                break; 
        }
    }
}
const MyPromise2 = new MyPromise((resolve, reject) => {
    setTimeout(() => resolve(1), 2000);
}).then(v => { 
    console.log(v);
    return new Promise((resolve, reject) => {
        resolve(10);
    });
})
.then()
.then()
.then((v) => {
    console.log(v);
});