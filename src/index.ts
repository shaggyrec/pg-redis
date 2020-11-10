import crypto from 'crypto';

function createHash (data) {
    return crypto
        .createHash('blake2b512')
        .update(JSON.stringify(data))
        .digest('base64');
}

interface PgRedisOptions {
    prefix?: string;
    expire?: number;
}

class PgRedis {
    private pg;
    private redis;
    private options: { prefix?: string; expire?: number };

    public constructor (pg: any, redis: any, options: PgRedisOptions) {
        this.pg = pg;
        this.redis = redis;
        this.options = options || { expire: 3600, prefix: 'pg-redis.' };
    }

    public query (sql: string, params = []): Promise<any> {
        const key = createHash([sql, params]);

        return new Promise((resolve, reject) => {
            this.redis.get(key, (err, res) => {
                if (err) {
                    return reject(err);
                }
                if (res) {
                    return resolve(JSON.parse(res));
                }
                this.pg.query(sql, params, (err, res) => {
                    if (err) {
                        return reject(err);
                    }

                    this.redis.set(key, JSON.stringify(res.rows));
                    resolve(res.rows);
                });
            });
        });
    }
}

export default PgRedis;
