'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// 依据Promises/A+规范实现promise

var Promise = function () {
    function Promise(executor) {
        var _this = this;

        _classCallCheck(this, Promise);

        this.status = 'pending';
        this.result = null;
        this.reason = null;
        this.resolveHandler = [];
        this.rejectHandler = [];

        var resolve = function resolve(val) {
            setTimeout(function () {
                if (_this.status === 'pending') {
                    _this.status = 'resolved';
                    _this.result = val;

                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = _this.resolveHandler[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var _resolve = _step.value;

                            _resolve(val);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                }
            });
        };

        var reject = function reject(reason) {
            setTimeout(function () {
                if (_this.status === 'pending') {
                    _this.status = 'rejected';
                    _this.reason = reason;

                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = _this.rejectHandler[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var _reject = _step2.value;

                            _reject(reason);
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }
            });
        };

        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }

    _createClass(Promise, [{
        key: 'then',
        value: function then(onFullfilled, onRejected) {
            var _this2 = this;

            onFullfilled = typeof onFullfilled === 'function' ? onFullfilled : function (value) {
                return value;
            };
            onRejected = typeof onRejected === 'function' ? onRejected : function (value) {
                return value;
            };

            var promise2 = void 0;

            switch (this.status) {
                case 'pending':
                    return promise2 = new Promise(function (resolve, reject) {
                        _this2.resolveHandler.push(function () {
                            try {
                                var x = onFullfilled(_this2.result);

                                Promise.solvePromise(promise2, x, resolve, reject);
                            } catch (err) {
                                reject(err);
                            }
                        });

                        _this2.rejectHandler.push(function () {
                            return promise2 = new Promise(function (resolve, reject) {
                                try {
                                    var x = onRejected(_this2.reason);

                                    Promise.solvePromise(promise, x, resolve, reject);
                                } catch (err) {
                                    reject(err);
                                }
                            });
                        });
                    });

                // 如果onFullfilled是个异步函数而this.resolve已经调用，那么此时状态就会变为resolved
                case 'resolved':
                    setTimeout(function () {
                        return promise2 = new Promise(function (resolve, reject) {
                            try {
                                var x = onFullfilled(_this2.result);

                                Promise.solvePromise(promise2, x, resolve, reject);
                            } catch (err) {
                                reject(err);
                            }
                        });
                    });

                case 'rejected':
                    setTimeout(function () {
                        return promise2 = new Promise(function (resolve, reject) {
                            try {
                                var x = onRejected(_this2.reason);

                                Promise.solvePromise(promise, x, resolve, reject);
                            } catch (err) {
                                reject(err);
                            }
                        });
                    });
            }
        }
    }], [{
        key: 'solvePromise',
        value: function solvePromise(promise2, x, resolve, reject) {
            if (x === promise2) {
                return reject(new TypeError('promise与x为同一对象!'));
            }

            // 如果onFulfilled返回了一个promise，此时promise2要接受这个promise的状态
            if (x instanceof Promise) {
                if (x.status === 'pending') {
                    x.then(function (value) {
                        return Promise.solvePromise(promise2, value, resolve, reject);
                    });
                } else {
                    x.then(resolve, reject);
                }
                return;
            }

            // 如果x是对象或者函数
            // 为了与其他的promise实现进行兼容
            var then = void 0;
            var hasResolveOrReject = false;
            if (x !== null && (typeof x === 'function' || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object')) {

                try {
                    then = x.then;
                } catch (e) {
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
    }, {
        key: 'deferred',
        value: function deferred() {
            var dfd = {};
            dfd.promise = new Promise(function (resolve, reject) {
                dfd.resolve = resolve;
                dfd.reject = reject;
            });
            return dfd;
        }
    }]);

    return Promise;
}();

exports.MyPromise = Promise;
