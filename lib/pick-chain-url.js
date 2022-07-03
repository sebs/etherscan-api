const MAIN_API_URL = 'https://api.etherscan.io';
const OTHER_API_URL_MAP = {
  ropsten: 'https://api-ropsten.etherscan.io',
  kovan: 'https://api-kovan.etherscan.io',
  rinkeby: 'https://api-rinkeby.etherscan.io',
  homestead: 'https://api.etherscan.io',
  arbitrum: 'https://api.arbiscan.io',
  arbitrum_rinkeby: 'https://api-testnet.arbiscan.io'
};

/**
 * gets  the correct urls of the backend 
 * @param {string} chain 
 * @returns Url of backend
 */
function pickChainUrl(chain) {
    if (!chain || !OTHER_API_URL_MAP[chain]) {
      return MAIN_API_URL;
    }
    return OTHER_API_URL_MAP[chain];
}


  module.exports = pickChainUrl;