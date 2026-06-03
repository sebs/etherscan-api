'use strict';
const nock = require('nock');

// Root Hook Plugin (loaded via .mocharc "require"). Guarantees the unit suite
// never reaches the network: any un-mocked request fails loudly instead of
// silently hitting the live Etherscan API. The opt-in live suite
// (ETHERSCAN_LIVE=1) needs real connectivity, so we only lock down when absent.
exports.mochaHooks = {
  beforeAll() {
    if (!process.env.ETHERSCAN_LIVE) {
      nock.disableNetConnect();
    }
  },
  afterEach() {
    nock.cleanAll();
  },
  afterAll() {
    nock.enableNetConnect();
  }
};
