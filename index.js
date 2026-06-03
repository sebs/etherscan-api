'use strict';
const init = require('./lib/init');
const { resolveChainId } = require('./lib/chains');

/**
 * Removed in v11. The Etherscan V2 API uses a single base URL and selects the
 * network with a `chainid` parameter, so there is no longer a per-chain URL to
 * pick. Pass a chain name or numeric chainid to `init(apiKey, chain)`, or call
 * `resolveChainId(chain)` if you need the id directly.
 */
function pickChainUrl() {
  throw new Error(
    'pickChainUrl was removed in v11: Etherscan V2 uses one base URL with a ' +
    'chainid parameter. Pass a chain name or numeric chainid to init(apiKey, chain), ' +
    'or use resolveChainId(chain).'
  );
}

module.exports = {
  init,
  resolveChainId,
  pickChainUrl
};
