import itretry from '../';
import {expect} from 'chai';

it.retry = itretry;

describe('itretry', function() {
    (function() {
        let i = 1;

        it.retry(5, 'retries the thing 5 times', function() {
            i++;
            expect(i).to.equal(5);
        });
    })();

    (function() {
        let i = 0;

        it.retry(5, 'retries async its with returned promises', function() {
            return new Promise((resolve) => {
                i++;
                expect(i).to.equal(5);
                resolve();
            });
        });
    })();

    (function() {
        let i = 1;

        it.retry(5, 'retries async its with done', function(done) {
            Promise.resolve().then(() => {
                i++;
                expect(i).to.equal(5);
                done();
            });
        });
    })();
});
