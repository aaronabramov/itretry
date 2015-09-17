export default function itretry(retriesLeft = 2, name, fn) {
    let returned;
    let retryable = () => {
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
        throw new Error(`have no idea how to deal with it`)
    } else {
        it(name, function() {
            return retryable();
        });
    }
 }

function isPromise(promise) {
    return promise && typeof promise.then === 'function';
}
