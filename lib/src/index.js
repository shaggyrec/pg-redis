"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
function createHash(data) {
    return crypto_1.default
        .createHash('blake2b512')
        .update(JSON.stringify(data))
        .digest('base64');
}
var PgRedis = /** @class */ (function () {
    function PgRedis(pg, redis, options) {
        this.pg = pg;
        this.redis = redis;
        this.options = options || { expire: 3600, prefix: 'pg-redis.' };
    }
    PgRedis.prototype.query = function (sql, params) {
        var _this = this;
        if (params === void 0) { params = []; }
        var key = createHash([sql, params]);
        return new Promise(function (resolve, reject) {
            _this.redis.get(key, function (err, res) {
                if (err) {
                    return reject(err);
                }
                if (res) {
                    return resolve(res);
                }
                _this.pg.query(sql, params, function (err, res) {
                    if (err) {
                        return reject(err);
                    }
                    _this.redis.set(key, res.rows);
                    resolve(res.rows);
                });
            });
        });
    };
    return PgRedis;
}());
exports.default = PgRedis;
//# sourceMappingURL=index.js.map