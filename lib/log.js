const querystring = require('querystring');
module.exports = function(getRequest, apiKey) {
  return {
    /**
     * The Event Log API was designed to provide an alternative to the native eth_getLogs.
     */
     /**
      * returns the status of a specific transaction hash
      * @param {string} fromBlock - fromBlock
      * @param {string} toBlock - toBlock
      * @param {string} topic0 - topic (32 Bytes per topic)
      * @param {string} topic0_1_opr - and|or between topic0 & topic1
      * @param {string} topic1 - topic (32 Bytes per topic)
      * @param {string} topic1_2_opr - and|or between topic1 & topic2
      * @param {string} topic2 - topic (32 Bytes per topic)
      * @param {string} topic2_3_opr - and|or between topic2 & topic3
      * @param {string} topic3 - topic (32 Bytes per topic)
      * @param {string} topic0_2_opr - and|or between topic0 & topic2
      * @example https://etherscan.io/apis#logs
      * @returns {Promise.<object>}
      */
    getLogs(address,
            fromBlock,
            toBlock,
            topic0,
            topic0_1_opr,
            topic1,
            topic1_2_opr,
            topic2,
            topic2_3_opr,
            topic3,
            topic0_2_opr) {

      const module = 'logs';
      const action = 'getLogs';
      var params = {
        module, action, apiKey, address
      };

      if (address) {
        params.address = address;
      }

      if (fromBlock) {
        params.fromBlock = fromBlock;
      }

      if (toBlock) {
        params.toBlock = toBlock;
      }

      if (topic0) {
        params.topic0 = topic0;
      }

      if (topic0_1_opr) {
        params.topic0_1_opr = topic0_1_opr;
      }

      if (topic1) {
        params.topic1 = topic1;
      }

      if (topic1_2_opr) {
        params.topic1_2_opr = topic1_2_opr;
      }

      if (topic2) {
        params.topic2 = topic2;
      }

      if (topic2_3_opr) {
        params.topic2_3_opr = topic2_3_opr;
      }

      if (topic0_2_opr) {
        params.topic0_2_opr = topic0_2_opr;
      }

      if (topic3) {
        params.topic3 = topic3;
      }
      var query = querystring.stringify(params);
      return getRequest(query);
    }
  };
};
