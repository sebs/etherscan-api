export function contract(getRequest, postRequest) {
    return {
        /**
         * Returns the creator address and creation transaction hash for one or more
         * contracts (up to 5).
         * @param contractaddresses - A single contract address or an array of up to 5
         */
        getcontractcreation(contractaddresses) {
            const value = Array.isArray(contractaddresses) ? contractaddresses.join(',') : contractaddresses;
            return getRequest({ module: 'contract', action: 'getcontractcreation', contractaddresses: value });
        },
        /**
         * Returns the ABI of a verified contract.
         * @param address - Contract address
         */
        getabi(address) {
            return getRequest({ module: 'contract', action: 'getabi', address });
        },
        /**
         * Returns the source code of a verified contract.
         * @param address - Contract address
         */
        getsourcecode(address) {
            return getRequest({ module: 'contract', action: 'getsourcecode', address });
        },
        /**
         * Submits a contract's source code for verification (POST). Resolves with a
         * GUID you can poll with `checkverifystatus`.
         * @param params - Verification fields ({@link VerifySourceCodeParams})
         */
        verifysourcecode(params) {
            const body = { module: 'contract', action: 'verifysourcecode' };
            for (const [key, value] of Object.entries(params)) {
                if (value !== undefined) {
                    body[key] = value;
                }
            }
            return postRequest(body);
        },
        /**
         * Checks the status of a source-code verification request.
         * @param guid - The GUID returned by `verifysourcecode`
         */
        checkverifystatus(guid) {
            return getRequest({ module: 'contract', action: 'checkverifystatus', guid });
        },
        /**
         * Submits a proxy contract for verification (POST). Resolves with a GUID you
         * can poll with `checkproxyverification`.
         * @param address - Proxy contract address
         * @param expectedimplementation - (optional) expected implementation address
         */
        verifyproxycontract(address, expectedimplementation) {
            const body = { module: 'contract', action: 'verifyproxycontract', address };
            if (expectedimplementation) {
                body.expectedimplementation = expectedimplementation;
            }
            return postRequest(body);
        },
        /**
         * Checks the status of a proxy-contract verification request.
         * @param guid - The GUID returned by `verifyproxycontract`
         */
        checkproxyverification(guid) {
            return getRequest({ module: 'contract', action: 'checkproxyverification', guid });
        },
    };
}
