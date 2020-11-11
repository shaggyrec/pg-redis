"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert_1 = __importDefault(require("assert"));
var src_1 = __importDefault(require("../src"));
describe('PgRedis test', function () {
    var pgConnection;
    var redisConnection;
    var pgCallsCounter = 0;
    beforeEach(function () {
        pgConnection = {
            query: function (_, __, cb) {
                pgCallsCounter++;
                cb(null, { rows: [{ test: 2 }] });
            }
        };
        redisConnection = {
            storage: new Map(),
            get: function (key, cb) {
                if (!redisConnection.storage.has(key)) {
                    cb(null, null);
                    return;
                }
                cb(null, redisConnection.storage.get(key));
            },
            setex: function (key, _, value) {
                redisConnection.storage.set(key, value);
            }
        };
    });
    afterEach(function () {
        pgCallsCounter = 0;
    });
    it('should connect to db only once', function () { return __awaiter(void 0, void 0, void 0, function () {
        var pgRedis, res1, res2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pgRedis = new src_1.default(pgConnection, redisConnection, { expire: 20000 });
                    return [4 /*yield*/, pgRedis.query('SELECT 1 + $1 as test', [1])];
                case 1:
                    res1 = _a.sent();
                    return [4 /*yield*/, pgRedis.query('SELECT 1 + $1 as test', [1])];
                case 2:
                    res2 = _a.sent();
                    assert_1.default.deepStrictEqual(res1, res2);
                    assert_1.default.strictEqual(pgCallsCounter, 1);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=pgRedis.test.js.map