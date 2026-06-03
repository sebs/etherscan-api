'use strict';
const { before, afterEach, after } = require('node:test');
const nock = require('nock');

// Shared nock lifecycle for the unit suite. Call installNock() at the top of
// each test file. Guarantees the suite never reaches the network: any un-mocked
// request fails loudly instead of silently hitting the live Etherscan API. The
// opt-in live suite (ETHERSCAN_LIVE=1) needs real connectivity, so we only lock
// down when that flag is absent.
function installNock() {
  before(function () {
    if (!process.env.ETHERSCAN_LIVE) {
      nock.disableNetConnect();
    }
  });

  afterEach(function () {
    nock.cleanAll();
  });

  after(function () {
    nock.enableNetConnect();
  });
}

module.exports = { installNock };
