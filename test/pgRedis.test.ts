import assert from 'assert';

import PgRedis from '../src';

describe('PgRedis test', () => {
    let pgConnection;
    let redisConnection;

    let pgCallsCounter = 0;

    beforeEach(() => {
        pgConnection = {
            query: (_, __, cb) => {
                pgCallsCounter++;
                cb(null, { rows: [{ test: 2 }] });
            }
        };
        redisConnection = {
            storage: new Map(),
            get: (key, cb) => {
                if (!redisConnection.storage.has(key)) {
                    cb(null, null);
                    return;
                }
                cb(null, redisConnection.storage.get(key));
            },
            setex: (key, _, value) => {
                redisConnection.storage.set(key, value);
            }
        };
    });

    afterEach(() => {
        pgCallsCounter = 0;
    });

    it('should connect to db only once', async () => {
        const pgRedis = new PgRedis(pgConnection, redisConnection, { expire: 20000 });
        const res1 = await pgRedis.query('SELECT 1 + $1 as test', [1]);
        const res2 = await pgRedis.query('SELECT 1 + $1 as test', [1]);

        assert.deepStrictEqual(res1, res2);
        assert.strictEqual(pgCallsCounter, 1);
    });
});
