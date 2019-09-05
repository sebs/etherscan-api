(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.EtherscanClient = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Client = void 0;

var _account = require("./actions/account");

var _ClientAccountBalance = require("./client/ClientAccountBalance");

var _ClientAccountBalancemulti = require("./client/ClientAccountBalancemulti");

var _Address = require("./entities/Address");

var _Apikey = require("./entities/Apikey");

var _version = require("./version");

/**
 * Client for the api at etherscan.io
 */
class Client {
  constructor(apiKey) {
    this.apiKey = new _Apikey.ApiKey(apiKey);
    this.apiKey.validate();
  }
  /**
   * methods to access ethereum accounts
   * @param action
   */


  account(action) {
    if (!_account.account.get(action)) {
      throw new Error('unknown action');
    }

    const actions = {
      balance: (address, tag) => {
        const oAddress = new _Address.Address(address);
        return new _ClientAccountBalance.ClientAccountBalance(this.apiKey, oAddress, tag);
      },

      balancemulti(address, tag) {
        const oAddress = address.map(addresString => new _Address.Address(addresString));
        return new _ClientAccountBalancemulti.ClientAccountBalancemulti(this.apiKey, oAddress, tag);
      }

    };
    return actions[action];
  }

}
/**
 * Version number of the client
 */


exports.Client = Client;
Client.version = _version.VERSION;

},{"./actions/account":2,"./client/ClientAccountBalance":11,"./client/ClientAccountBalancemulti":12,"./entities/Address":14,"./entities/Apikey":15,"./version":20}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.account = void 0;

var _mapFromArray = require("../util/mapFromArray");

const actionNames = ['balance', 'balancemulti', 'txlist', 'txlistinternal', 'tokentx', 'getminedblocks'];
const account = (0, _mapFromArray.mapFromArray)(actionNames);
exports.account = account;

},{"../util/mapFromArray":19}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.block = void 0;

var _mapFromArray = require("../util/mapFromArray");

const actionNames = ['getblockreward'];
const block = (0, _mapFromArray.mapFromArray)(actionNames);
exports.block = block;

},{"../util/mapFromArray":19}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.contract = void 0;

var _mapFromArray = require("../util/mapFromArray");

const actionNames = ['getabi', 'getsourcecode'];
const contract = (0, _mapFromArray.mapFromArray)(actionNames);
exports.contract = contract;

},{"../util/mapFromArray":19}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "account", {
  enumerable: true,
  get: function () {
    return _account.account;
  }
});
Object.defineProperty(exports, "block", {
  enumerable: true,
  get: function () {
    return _block.block;
  }
});
Object.defineProperty(exports, "contract", {
  enumerable: true,
  get: function () {
    return _contract.contract;
  }
});
Object.defineProperty(exports, "logs", {
  enumerable: true,
  get: function () {
    return _logs.logs;
  }
});
Object.defineProperty(exports, "proxy", {
  enumerable: true,
  get: function () {
    return _proxy.proxy;
  }
});
Object.defineProperty(exports, "stats", {
  enumerable: true,
  get: function () {
    return _stats.stats;
  }
});
Object.defineProperty(exports, "tokens", {
  enumerable: true,
  get: function () {
    return _tokens.tokens;
  }
});
Object.defineProperty(exports, "transaction", {
  enumerable: true,
  get: function () {
    return _transaction.transaction;
  }
});

var _account = require("./account");

var _block = require("./block");

var _contract = require("./contract");

var _logs = require("./logs");

var _proxy = require("./proxy");

var _stats = require("./stats");

var _tokens = require("./tokens");

var _transaction = require("./transaction");

},{"./account":2,"./block":3,"./contract":4,"./logs":6,"./proxy":7,"./stats":8,"./tokens":9,"./transaction":10}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logs = void 0;

var _mapFromArray = require("../util/mapFromArray");

const actionNames = ['getLogs'];
const logs = (0, _mapFromArray.mapFromArray)(actionNames);
exports.logs = logs;

},{"../util/mapFromArray":19}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.proxy = void 0;

var _mapFromArray = require("../util/mapFromArray");

const actionNames = ['eth_blockNumber', 'eth_getBlockByNumber', 'eth_getBlockByNumberAndIndex', 'eth_getBlockTransactionCountByNumber', 'eth_getTransactionByHash', 'eth_getTransactionByBlockNumberAndIndex', 'eth_getTransactionCount', 'eth_sendRawTransaction', 'eth_getTransactionReceipt', 'eth_call', 'eth_getCode', 'eth_getStorageAt', 'eth_gasPrice', 'eth_estimateGas'];
const proxy = (0, _mapFromArray.mapFromArray)(actionNames);
exports.proxy = proxy;

},{"../util/mapFromArray":19}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stats = void 0;

var _mapFromArray = require("../util/mapFromArray");

const actionNames = ['ethsupply', 'ethprice'];
const stats = (0, _mapFromArray.mapFromArray)(actionNames);
exports.stats = stats;

},{"../util/mapFromArray":19}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tokens = void 0;

var _mapFromArray = require("../util/mapFromArray");

const actionNames = ['tokenbalance', 'tokensupply'];
const tokens = (0, _mapFromArray.mapFromArray)(actionNames);
exports.tokens = tokens;

},{"../util/mapFromArray":19}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transaction = void 0;

var _mapFromArray = require("../util/mapFromArray");

const actionNames = ['getstatus', 'gettxreceiptstatus'];
const transaction = (0, _mapFromArray.mapFromArray)(actionNames);
exports.transaction = transaction;

},{"../util/mapFromArray":19}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClientAccountBalance = void 0;

var _requestBuilder = require("../requestBuilder");

var _ClientBase = require("./ClientBase");

/**
 * Client for the account balance
 */
class ClientAccountBalance extends _ClientBase.ClientBase {
  constructor(apiKey, address, tag) {
    super();
    /**
     * module of the etherscan api to request
     */

    this.module = 'account';
    /**
     * action of the etherscan api to request
     */

    this.action = 'balance';
    this.apiKey = apiKey;
    this.address = address;
    this.tag = tag;
  }
  /**
   * Returns the serice url
   * @returns url
   */


  toUrl() {
    return (0, _requestBuilder.requestBuilder)(this.module, this.action, {
      address: this.address.toString(),
      apiKey: this.apiKey.toString(),
      tag: this.tag.toString()
    });
  }

}

exports.ClientAccountBalance = ClientAccountBalance;

},{"../requestBuilder":18,"./ClientBase":13}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClientAccountBalancemulti = void 0;

var _requestBuilder = require("../requestBuilder");

var _ClientBase = require("./ClientBase");

/**
 * Client for the account balance
 */
class ClientAccountBalancemulti extends _ClientBase.ClientBase {
  constructor(apiKey, address, tag) {
    super();
    /**
     * module of the etherscan api to request
     */

    this.module = 'account';
    /**
     * action of the etherscan api to request
     */

    this.action = 'balancemulti';
    this.apiKey = apiKey;
    this.address = address;
    this.tag = tag;
  }
  /**
   * Returns the serice url
   * @returns url
   */


  toUrl() {
    return (0, _requestBuilder.requestBuilder)(this.module, this.action, {
      address: this.address.toString(),
      apiKey: this.apiKey.toString(),
      tag: this.tag.toString()
    });
  }

}

exports.ClientAccountBalancemulti = ClientAccountBalancemulti;

},{"../requestBuilder":18,"./ClientBase":13}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClientBase = void 0;

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
/**
 * Basic functions shared by all clients
 */


class ClientBase {
  /**
   * Creates a URL for the API
   */
  toUrl() {
    return '';
  }
  /**
   * Dies the actual request to the server
   */


  request() {
    return __awaiter(this, void 0, void 0, function* () {
      return fetch(this.toUrl()).then(response => response.json());
    });
  }
  /**
   * Processes the result and return it
   * @param result String result of a request
   */


  processResult(result) {
    return JSON.parse(result);
  }

}

exports.ClientBase = ClientBase;

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Address = void 0;

var _EntityBase = require("./EntityBase");

/**
 * A ethereum address
 */
class Address extends _EntityBase.EntityBase {
  constructor(address) {
    super(address);
    this.errorMessage = 'Invalid Address';
  }
  /**
   * Checks validity of the address
   */


  valid() {
    const regex = /0x[a-fA-F0-9]{40}/;
    return this.value.match(regex) !== null;
  }

}

exports.Address = Address;

},{"./EntityBase":16}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ApiKey = void 0;

var _EntityBase = require("./EntityBase");

/**
 * Api key for etherscan.io
 */
class ApiKey extends _EntityBase.EntityBase {
  constructor(apiKey) {
    super(apiKey);
    /**
     * Error Message for validation errors
     */

    this.errorMessage = 'invalid';
    /**
     * Key lenght of a apiKey
     */

    this.keyLength = 34;
  }
  /**
   * Checks validty of a apiKey
   */


  valid() {
    return this.value.length === this.keyLength;
  }

}

exports.ApiKey = ApiKey;

},{"./EntityBase":16}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EntityBase = void 0;

/**
 * base class for entities
 */
class EntityBase {
  constructor(value) {
    this.value = value;
    this.errorMessage = 'invalid value';
  }
  /**
   * checks valid() and throws errorMessage
   */


  validate() {
    if (!this.valid()) {
      throw new Error(this.errorMessage);
    }
  }
  /**
   *  converts the entity to a string
   */


  toString() {
    return this.value.toString();
  }
  /**
   * validates the entity
   */


  valid() {
    return true;
  }

}

exports.EntityBase = EntityBase;

},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modules = void 0;

var _mapFromArray = require("./util/mapFromArray");

const moduleNames = ['account', 'contract', 'transaction', 'block', 'logs', 'proxy', 'stats'];
const modules = (0, _mapFromArray.mapFromArray)(moduleNames);
exports.modules = modules;

},{"./util/mapFromArray":19}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestBuilder = void 0;

var _querystring = require("querystring");

var _index = require("./actions/index");

var _modules = require("./modules");

const base = 'https://api.etherscan.io/api';
const actions = new Map();
actions.set('account', _index.account);
actions.set('block', _index.block);
actions.set('contract', _index.contract);
actions.set('logs', _index.logs);
actions.set('proxy', _index.proxy);
actions.set('stats', _index.stats);
actions.set('tokens', _index.tokens);
actions.set('transaction', _index.transaction);

const requestBuilder = (module, action, params) => {
  if (!_modules.modules.get(module)) {
    throw Error('unknown module');
  }

  if (!actions.get(module).get(action)) {
    throw Error('unknown action');
  }

  const baseParams = {
    action,
    module
  };
  const toEncodeParams = Object.assign(baseParams, params);
  const query = (0, _querystring.encode)(toEncodeParams);
  return `${base}?${query}`;
};

exports.requestBuilder = requestBuilder;

},{"./actions/index":5,"./modules":17,"querystring":23}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapFromArray = mapFromArray;

/**
 * easily create js maps from simple arrays
 */
function mapFromArray(arr) {
  const map = new Map();
  arr.map(name => map.set(name, name));
  return map;
}

},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VERSION = void 0;
const VERSION = '100.0.0';
exports.VERSION = VERSION;

},{}],21:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],22:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],23:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":21,"./encode":22}]},{},[1])(1)
});
