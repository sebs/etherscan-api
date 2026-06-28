import { isUnsafeKey } from './get-request.js';
import type { GetRequest, PostRequest, QueryParams } from './get-request.js';
import type { EtherscanResponse } from './types.js';
import type { ContractCreation, ContractSource } from './results.js';

/** Common fields shared by the contract-verification endpoints. */
export interface VerifyParams {
  /** Address the contract is deployed at. */
  contractaddress: string;
  /** The source, or a standard-json-input string. */
  sourceCode: string;
  /** Contract name (or `path:Name` for standard-json-input). */
  contractname: string;
  optimizationUsed?: 0 | 1 | string;
  runs?: number | string;
  /** ABI-encoded constructor arguments (without the leading `0x`). */
  constructorArguements?: string;
  licenseType?: number | string;
  /** Any further endpoint-specific fields are passed through. */
  [key: string]: string | number | undefined;
}

/** Parameters for `contract.verifysourcecode` (Solidity). */
export interface VerifySourceCodeParams extends VerifyParams {
  /** e.g. `'solidity-single-file'` or `'solidity-standard-json-input'`. */
  codeformat?: string;
  /** Full compiler version, e.g. `'v0.8.24+commit.e11b9ed9'`. */
  compilerversion: string;
  evmversion?: string;
}

/** Build the form body for a verification POST, dropping undefined fields. */
function verifyBody(action: string, params: VerifyParams): QueryParams {
  const body: QueryParams = { module: 'contract', action };
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && !isUnsafeKey(key)) {
      body[key] = value;
    }
  }
  return body;
}

export function contract(getRequest: GetRequest, postRequest: PostRequest) {
  return {
    /**
     * Returns the creator address and creation transaction hash for one or more
     * contracts (up to 5).
     * @param contractaddresses - A single contract address or an array of up to 5
     */
    getcontractcreation(contractaddresses: string | string[]): Promise<EtherscanResponse<ContractCreation[]>> {
      const value = Array.isArray(contractaddresses) ? contractaddresses.join(',') : contractaddresses;
      return getRequest<ContractCreation[]>({ module: 'contract', action: 'getcontractcreation', contractaddresses: value });
    },

    /**
     * Returns the ABI of a verified contract (JSON encoded as a string).
     * @param address - Contract address
     */
    getabi(address: string): Promise<EtherscanResponse<string>> {
      return getRequest<string>({ module: 'contract', action: 'getabi', address });
    },

    /**
     * Returns the source code of a verified contract.
     * @param address - Contract address
     */
    getsourcecode(address: string): Promise<EtherscanResponse<ContractSource[]>> {
      return getRequest<ContractSource[]>({ module: 'contract', action: 'getsourcecode', address });
    },

    /**
     * Submits a contract's source code for verification (POST). Resolves with a
     * GUID (string) you can poll with `checkverifystatus`.
     * @param params - Verification fields ({@link VerifySourceCodeParams})
     */
    verifysourcecode(params: VerifySourceCodeParams): Promise<EtherscanResponse<string>> {
      return postRequest<string>(verifyBody('verifysourcecode', params));
    },

    /**
     * Submits Vyper source code for verification (POST). Resolves with a GUID.
     * @param params - Verification fields ({@link VerifyParams})
     */
    verifyvyper(params: VerifyParams): Promise<EtherscanResponse<string>> {
      return postRequest<string>(verifyBody('verifyvyper', params));
    },

    /**
     * Submits Stylus (Rust/WASM) source code for verification (POST). Resolves with a GUID.
     * @param params - Verification fields ({@link VerifyParams})
     */
    verifystylus(params: VerifyParams): Promise<EtherscanResponse<string>> {
      return postRequest<string>(verifyBody('verifystylus', params));
    },

    /**
     * Submits zkSync-compiled source code for verification (POST). Resolves with a GUID.
     * @param params - Verification fields ({@link VerifyParams}); include `compilerversion`
     */
    verifyzksyncsourcecode(params: VerifyParams): Promise<EtherscanResponse<string>> {
      return postRequest<string>(verifyBody('verifyzksyncsourcecode', params));
    },

    /**
     * Checks the status of a source-code verification request.
     * @param guid - The GUID returned by `verifysourcecode`
     */
    checkverifystatus(guid: string): Promise<EtherscanResponse<string>> {
      return getRequest<string>({ module: 'contract', action: 'checkverifystatus', guid });
    },

    /**
     * Submits a proxy contract for verification (POST). Resolves with a GUID
     * (string) you can poll with `checkproxyverification`.
     * @param address - Proxy contract address
     * @param expectedimplementation - (optional) expected implementation address
     */
    verifyproxycontract(address: string, expectedimplementation?: string): Promise<EtherscanResponse<string>> {
      const body: QueryParams = { module: 'contract', action: 'verifyproxycontract', address };
      if (expectedimplementation) {
        body.expectedimplementation = expectedimplementation;
      }
      return postRequest<string>(body);
    },

    /**
     * Checks the status of a proxy-contract verification request.
     * @param guid - The GUID returned by `verifyproxycontract`
     */
    checkproxyverification(guid: string): Promise<EtherscanResponse<string>> {
      return getRequest<string>({ module: 'contract', action: 'checkproxyverification', guid });
    },
  };
}
