import type { GetRequest, PostRequest, QueryParams } from './get-request.js';
import type { EtherscanResponse } from './types.js';

/** Parameters for `contract.verifysourcecode`. Extra fields are passed through. */
export interface VerifySourceCodeParams {
  /** Address the contract is deployed at. */
  contractaddress: string;
  /** The Solidity/Vyper source, or a standard-json-input string. */
  sourceCode: string;
  /** e.g. `'solidity-single-file'` or `'solidity-standard-json-input'`. */
  codeformat?: string;
  /** Contract name (or `path:Name` for standard-json-input). */
  contractname: string;
  /** Full compiler version, e.g. `'v0.8.24+commit.e11b9ed9'`. */
  compilerversion: string;
  optimizationUsed?: 0 | 1 | string;
  runs?: number | string;
  /** ABI-encoded constructor arguments (without the leading `0x`). */
  constructorArguements?: string;
  evmversion?: string;
  licenseType?: number | string;
  [key: string]: string | number | undefined;
}

export function contract(getRequest: GetRequest, postRequest: PostRequest) {
  return {
    /**
     * Returns the creator address and creation transaction hash for one or more
     * contracts (up to 5).
     * @param contractaddresses - A single contract address or an array of up to 5
     */
    getcontractcreation(contractaddresses: string | string[]): Promise<EtherscanResponse> {
      const value = Array.isArray(contractaddresses) ? contractaddresses.join(',') : contractaddresses;
      return getRequest({ module: 'contract', action: 'getcontractcreation', contractaddresses: value });
    },

    /**
     * Returns the ABI of a verified contract.
     * @param address - Contract address
     */
    getabi(address: string): Promise<EtherscanResponse> {
      return getRequest({ module: 'contract', action: 'getabi', address });
    },

    /**
     * Returns the source code of a verified contract.
     * @param address - Contract address
     */
    getsourcecode(address: string): Promise<EtherscanResponse> {
      return getRequest({ module: 'contract', action: 'getsourcecode', address });
    },

    /**
     * Submits a contract's source code for verification (POST). Resolves with a
     * GUID you can poll with `checkverifystatus`.
     * @param params - Verification fields ({@link VerifySourceCodeParams})
     */
    verifysourcecode(params: VerifySourceCodeParams): Promise<EtherscanResponse> {
      const body: QueryParams = { module: 'contract', action: 'verifysourcecode' };
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
    checkverifystatus(guid: string): Promise<EtherscanResponse> {
      return getRequest({ module: 'contract', action: 'checkverifystatus', guid });
    },

    /**
     * Submits a proxy contract for verification (POST). Resolves with a GUID you
     * can poll with `checkproxyverification`.
     * @param address - Proxy contract address
     * @param expectedimplementation - (optional) expected implementation address
     */
    verifyproxycontract(address: string, expectedimplementation?: string): Promise<EtherscanResponse> {
      const body: QueryParams = { module: 'contract', action: 'verifyproxycontract', address };
      if (expectedimplementation) {
        body.expectedimplementation = expectedimplementation;
      }
      return postRequest(body);
    },

    /**
     * Checks the status of a proxy-contract verification request.
     * @param guid - The GUID returned by `verifyproxycontract`
     */
    checkproxyverification(guid: string): Promise<EtherscanResponse> {
      return getRequest({ module: 'contract', action: 'checkproxyverification', guid });
    },
  };
}
