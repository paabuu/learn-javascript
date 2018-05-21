function promisify(callbackApi) {
    return function() {
        const args = [].slice.call(arguments);
        return new Promise((resolve, reject) => {
            args.push((err, result) => {
                if (err) {
                    return reject(err);
                }

                if (args.length <= 2) {
                    resolve(result);
                } else {
                    resolve([].slice.call(arguments, 1));
                }
            });
            callbackApi.apply(null, args);
        });
    }
}

exports.promisify = promisify;
