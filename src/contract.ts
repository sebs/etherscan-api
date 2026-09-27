import { emptyAsList, isUnsafeKey } from './get-request.js';
import { compact } from './params.js';
import type { GetRequest, PostRequest, QueryParams } from './get-request.js';
import type { EtherscanResponse } from './types.js';
import type { ContractCreation, ContractSource } from './results.js';

/**
 * Common fields shared by the contract-verification endpoints.
 *
 * The field set is closed so a misspelt name (`optimisationUsed`, say) is a
 * compile error instead of a field Etherscan silently ignores. Every field is
 * still forwarded at runtime, so for a field not listed here, widen the object
 * with a type assertion.
 */
export interface VerifyParams {
  /** Address the contract is deployed at. */
  contractaddress: string;
  /** The source, or a standard-json-input string. */
  sourceCode: string;
  /** Contract name (or `path:Name` for standard-json-input). */
  contractname: string;
  /** e.g. `'solidity-single-file'`, `'solidity-standard-json-input'`, `'vyper-json'` or `'stylus'`. */
  codeformat?: string;
  /** Compiler version, e.g. `'v0.8.24+commit.e11b9ed9'`. */
  compilerversion?: string;
  optimizationUsed?: 0 | 1 | string;
  runs?: number | string;
  /** ABI-encoded constructor arguments (without the leading `0x`). Etherscan's spelling. */
  constructorArguements?: string;
  evmversion?: string;
  licenseType?: number | string;
  /** zkSync compiler mode (`verifyzksyncsourcecode`). */
  compilermode?: string;
  /** zksolc version (`verifyzksyncsourcecode`). */
  zksolcVersion?: string;
  /** Linked library names, `libraryname1` … `libraryname10`. */
  [library: `libraryname${number}`]: string | undefined;
  /** Linked library addresses, `libraryaddress1` … `libraryaddress10`. */
  [library: `libraryaddress${number}`]: string | undefined;
}

/** Parameters for `contract.verifysourcecode` (Solidity). */
export interface VerifySourceCodeParams extends VerifyParams {
  /** Full compiler version, e.g. `'v0.8.24+commit.e11b9ed9'`. */
  compilerversion: string;
}

/** Build the form body for a verification POST, dropping undefined fields. */
function verifyBody(action: string, params: VerifyParams): QueryParams {
  const body: QueryParams = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && !isUnsafeKey(key)) {
      body[key] = value;
    }
  }
  // Set last so a stray `module`/`action` key in the params (possible from
  // plain JS) cannot redirect the call to another endpoint.
  body.module = 'contract';
  body.action = action;
  return body;
}

/** Etherscan's `getcontractcreation` accepts at most 5 addresses per call. */
const MAX_CONTRACT_CREATION = 5;

export function contract(getRequest: GetRequest, postRequest: PostRequest) {
  return {
    /**
     * Returns the creator address and creation transaction hash for one or more
     * contracts (up to 5).
     * @param contractaddresses - A single contract address or an array of up to 5
     */
    getcontractcreation(contractaddresses: string | string[]): Promise<EtherscanResponse<ContractCreation[]>> {
      // Count a comma-joined string's entries too, so it cannot bypass the limit.
      const list = Array.isArray(contractaddresses) ? contractaddresses : contractaddresses.split(',');
      if (list.length === 0 || list.length > MAX_CONTRACT_CREATION) {
        return Promise.reject(
          new Error(`getcontractcreation() takes 1 to ${MAX_CONTRACT_CREATION} addresses, got ${list.length}`),
        );
      }
      const value = list.join(',');
      return emptyAsList(
        getRequest<ContractCreation[]>({ module: 'contract', action: 'getcontractcreation', contractaddresses: value }),
      );
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
      return emptyAsList(getRequest<ContractSource[]>({ module: 'contract', action: 'getsourcecode', address }));
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
     * Checks the status of a source-code verification request. Resolves only for
     * `"Pass - Verified"`. Etherscan reports the other states (`"Pending in
     * queue"`, `"Fail - …"`) with status `"0"`, so they reject with an
     * {@link EtherscanError} whose `result` carries the status text.
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
      return postRequest<string>(
        compact({ module: 'contract', action: 'verifyproxycontract', address, expectedimplementation }),
      );
    },

    /**
     * Checks the status of a proxy-contract verification request. As with
     * `checkverifystatus`, a pending or failed verification rejects with an
     * {@link EtherscanError} whose `result` carries the status text.
     * @param guid - The GUID returned by `verifyproxycontract`
     */
    checkproxyverification(guid: string): Promise<EtherscanResponse<string>> {
      return getRequest<string>({ module: 'contract', action: 'checkproxyverification', guid });
    },
  };
}
