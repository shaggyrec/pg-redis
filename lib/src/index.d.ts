interface PgRedisOptions {
    prefix?: string;
    expire?: number;
}
declare class PgRedis {
    private pg;
    private redis;
    private options;
    constructor(pg: any, redis: any, options: PgRedisOptions);
    query(sql: string, params?: any[]): Promise<any>;
}
export default PgRedis;
