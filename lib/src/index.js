"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var defaultOptions = { expire: 3600, prefix: 'pg-redis.' };
var PgRedis = /** @class */ (function () {
    function PgRedis(pg, redis, options) {
        if (options === void 0) { options = {}; }
        this.pg = pg;
        this.redis = redis;
        this.options = __assign(__assign({}, defaultOptions), options);
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
                    return resolve(JSON.parse(res));
                }
                _this.pg.query(sql, params, function (err, res) {
                    if (err) {
                        return reject(err);
                    }
                    _this.redis.setex(key, _this.options.expire, JSON.stringify(res.rows));
                    resolve(res.rows);
                });
            });
        });
    };
    return PgRedis;
}());
exports.default = PgRedis;
//# sourceMappingURL=index.js.map