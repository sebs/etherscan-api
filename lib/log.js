export function log(getRequest) {
    return {
        /**
         * The Event Log API — an alternative to the native `eth_getLogs`. Only the
         * arguments you provide are sent.
         * @param address - Address to filter logs by
         * @param fromBlock - From block
         * @param toBlock - To block
         * @param topic0 - Topic 0 (32 bytes)
         * @param topic0_1_opr - and|or operator between topic0 \& topic1
         * @param topic1 - Topic 1 (32 bytes)
         * @param topic1_2_opr - and|or operator between topic1 \& topic2
         * @param topic2 - Topic 2 (32 bytes)
         * @param topic2_3_opr - and|or operator between topic2 \& topic3
         * @param topic3 - Topic 3 (32 bytes)
         * @param topic0_2_opr - and|or operator between topic0 \& topic2
         * @see https://docs.etherscan.io/api-endpoints/logs
         */
        getLogs(address, fromBlock, toBlock, topic0, topic0_1_opr, topic1, topic1_2_opr, topic2, topic2_3_opr, topic3, topic0_2_opr) {
            const params = { module: 'logs', action: 'getLogs' };
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
            return getRequest(params);
        },
    };
}
