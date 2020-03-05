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
exports.__esModule = true;
var react_1 = require("react");
/**
 * vuex like store management
 *
 * @export
 * @template T
 * @param {Store<T>} store
 * @returns {state,commit,dispatch}
 */
function useStore(store, log) {
    var _this = this;
    if (log === void 0) { log = false; }
    var state = store.state, actions = store.actions, asyncActions = store.asyncActions;
    var reducer = function (state, action) {
        var _a, _b;
        var commitType = action.commitType, payload = action.payload;
        var getAction = (_a = actions) === null || _a === void 0 ? void 0 : _a[commitType];
        if (!getAction) {
            console.error("action " + commitType + " not founded");
            return state;
        }
        if (log) {
            console.log("commit action: " + commitType + " at " + new Date());
            console.log("---------");
            console.dir(state);
            console.log("to:");
        }
        var newState = ((_b = getAction) === null || _b === void 0 ? void 0 : _b(state, payload)) || state;
        if (log) {
            console.dir(newState);
            console.log("----------");
        }
        // TODO: add deepClone difference to handle object change
        return newState;
    };
    // original useReducer
    var _a = react_1.useReducer(reducer, state), _state = _a[0], _dispatch = _a[1];
    // vuex style of action commit
    var commit = function (type, payload) {
        if (payload === void 0) { payload = null; }
        _dispatch({ commitType: type, payload: payload });
    };
    // vuex style of asynchronous action dispatch
    var dispatch = function (type, payload) {
        if (payload === void 0) { payload = null; }
        return __awaiter(_this, void 0, void 0, function () {
            var getAsyncAction;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        getAsyncAction = (_a = asyncActions) === null || _a === void 0 ? void 0 : _a[type];
                        if (!getAsyncAction) {
                            console.error("async action " + type + " not founded");
                            return [2 /*return*/];
                        }
                        if (log) {
                            console.log("dispatch async action: " + type + " at " + new Date());
                        }
                        return [4 /*yield*/, ((_b = getAsyncAction) === null || _b === void 0 ? void 0 : _b({ state: _state, commit: commit }, payload))];
                    case 1: return [2 /*return*/, _c.sent()];
                }
            });
        });
    };
    return { state: _state, commit: commit, dispatch: dispatch };
}
exports.useStore = useStore;
/**
 * useState in object form
 *
 * @export
 * @template T
 * @param {T} defaultValue
 * @returns
 */
function useToken(defaultValue) {
    var _a = react_1.useState(defaultValue), value = _a[0], setValue = _a[1];
    return { value: value, setValue: setValue };
}
exports.useToken = useToken;
/**
 * define a stateHook whether or not the provider:StateHook provided
 *
 * @export
 * @template T
 * @param {StateHook<T>} provider$
 * @param {T} defaultValue
 * @returns
 */
function useProvider(provider$, defaultValue) {
    var local$ = react_1.useState(defaultValue);
    var value = local$[0], setValue = local$[1];
    return provider$ || { value: value, setValue: setValue };
}
exports.useProvider = useProvider;
/**
 * define a storeHook whether or not the provider:storeHook provided
 *
 * @export
 * @template T
 * @param {StoreHook<T>} provider$
 * @param {Store<T>} initStore
 * @returns {StoreHook<T>}
 */
function useStoreProvider(provider$, initStore, log) {
    if (log === void 0) { log = false; }
    var local$ = useStore(initStore, log);
    return provider$ || local$;
}
exports.useStoreProvider = useStoreProvider;
