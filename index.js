import {inspect} from 'util';

const TIMEOUT = 500;

export default function itretry(retriesLeft = 2, name, fn) {
    let returned;
    let retryable = () => {
        if (fn.length === 1) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    retryable().then(resolve, reject);
                }, TIMEOUT);
                let done = (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                };

                fn(done);
            });
        }

        try {
            returned = fn();
            if (isPromise(returned)) {
                return new Promise((resolve, reject) => {
                    returned.then(() => {
                        resolve();
                    }).catch((err) => {
                        if (retriesLeft) {
                            retriesLeft--;
                            retryable().then(resolve).catch(reject);
                        } else {
                            reject(err);
                        }
                    });
                });
            } else {
                return returned;
            }
        } catch (err) {
            if (retriesLeft) {
                retriesLeft--;
                return retryable();
            } else {
                throw err;
            }
        }
    };


    if (fn.length === 1) {
        // that's the use case where done is passed
        it(name, function(done) {
            retryable().then(() => {
                done();
            }).catch((err) => {
                done(err);
            });
        });
    } else {
        it(name, function() {
            return retryable();
        });
    }
 }

function isPromise(promise) {
    return promise && typeof promise.then === 'function';
}
