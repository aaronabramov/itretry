# itretry
Retry individual mocha tests. Useful for e2e tests on sketchy connections.

```js
import itretry from 'itretry';

it.retry = itretry;

let i = 0;

describe('something', function() {
    it.retry(5, 'retries until it succeeds', function() {
        i++;
        expect(i).to.equal(5);
    });
});

// something
//      ✓ retries the thing 5 times
```

works with async tests too

```js
it.retry(5, 'tests something', function() {
    return Promise.resolve();
});

it.retry(9999, 'async with done', function(done) {
    set.timeout(() => {
        expect(Math.random()).to.be.below(.1);
        done();
    }, 100);
});
```
