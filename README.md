# pg-redis

Cache your postgres queries in NodeJs using redis

    npm install pg-redis-nodejs

## Usage

    const PgRedis = require('pg-redis-nodejs');
    // or
    import PgRedis from 'pg-redis';
    
    const pgRedis = new PgRedis(
        pgConnection,
        redisConnection,
        {
            expired: 3600, // optional
            prefix: 'pg-redis.' // optional
        }
    );
    
    const rows = await pgRedis.query('SELECT id FROM user WHERE id = $1', [666]);
 

