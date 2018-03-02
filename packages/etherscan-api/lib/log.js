const querystring = require('querystring');
module.exports = function(getRequest, apiKey) {
  return {
    /**
     * The Event Log API was designed to provide an alternative to the native eth_getLogs.
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
            topic3) {

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

      if (topic3) {
        params.topic3 = topic3;
      }
      var query = querystring.stringify(params);
      return getRequest(query);
    }
  };
};
