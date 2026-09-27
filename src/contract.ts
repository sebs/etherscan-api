import { compact } from './params.js';
import type { RequestContext } from './get-request.js';
import { checkAddressCount } from './validation.js';
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

/** Etherscan's `getcontractcreation` accepts at most 5 addresses per call. */
const MAX_CONTRACT_CREATION = 5;

export function contract(ctx: RequestContext) {
  const { call, list, post } = ctx.module('contract');

  return {
    /**
     * Returns the creator address and creation transaction hash for one or more
     * contracts (up to 5).
     * @param contractaddresses - A single contract address or an array of up to 5
     */
    async getcontractcreation(contractaddresses: string | string[]): Promise<EtherscanResponse<ContractCreation[]>> {
      // Count a comma-joined string's entries too, so it cannot bypass the limit.
      const addresses = Array.isArray(contractaddresses) ? contractaddresses : contractaddresses.split(',');
      checkAddressCount('getcontractcreation', addresses, MAX_CONTRACT_CREATION);
      return list<ContractCreation[]>('getcontractcreation', { contractaddresses: addresses.join(',') });
    },

    /**
     * Returns the ABI of a verified contract (JSON encoded as a string).
     * @param address - Contract address
     */
    getabi(address: string): Promise<EtherscanResponse<string>> {
      return call<string>('getabi', { address });
    },

    /**
     * Returns the source code of a verified contract.
     * @param address - Contract address
     */
    getsourcecode(address: string): Promise<EtherscanResponse<ContractSource[]>> {
      return list<ContractSource[]>('getsourcecode', { address });
    },

    /**
     * Submits a contract's source code for verification (POST). Resolves with a
     * GUID (string) you can poll with `checkverifystatus`.
     * @param params - Verification fields ({@link VerifySourceCodeParams})
     */
    verifysourcecode(params: VerifySourceCodeParams): Promise<EtherscanResponse<string>> {
      return post<string>('verifysourcecode', { ...params });
    },

    /**
     * Submits Vyper source code for verification (POST). Resolves with a GUID.
     * @param params - Verification fields ({@link VerifyParams})
     */
    verifyvyper(params: VerifyParams): Promise<EtherscanResponse<string>> {
      return post<string>('verifyvyper', { ...params });
    },

    /**
     * Submits Stylus (Rust/WASM) source code for verification (POST). Resolves with a GUID.
     * @param params - Verification fields ({@link VerifyParams})
     */
    verifystylus(params: VerifyParams): Promise<EtherscanResponse<string>> {
      return post<string>('verifystylus', { ...params });
    },

    /**
     * Submits zkSync-compiled source code for verification (POST). Resolves with a GUID.
     * @param params - Verification fields ({@link VerifyParams}); include `compilerversion`
     */
    verifyzksyncsourcecode(params: VerifyParams): Promise<EtherscanResponse<string>> {
      return post<string>('verifyzksyncsourcecode', { ...params });
    },

    /**
     * Checks the status of a source-code verification request. Resolves only for
     * `"Pass - Verified"`. Etherscan reports the other states (`"Pending in
     * queue"`, `"Fail - …"`) with status `"0"`, so they reject with an
     * {@link EtherscanError} whose `result` carries the status text.
     * @param guid - The GUID returned by `verifysourcecode`
     */
    checkverifystatus(guid: string): Promise<EtherscanResponse<string>> {
      return call<string>('checkverifystatus', { guid });
    },

    /**
     * Submits a proxy contract for verification (POST). Resolves with a GUID
     * (string) you can poll with `checkproxyverification`.
     * @param address - Proxy contract address
     * @param expectedimplementation - (optional) expected implementation address
     */
    verifyproxycontract(address: string, expectedimplementation?: string): Promise<EtherscanResponse<string>> {
      return post<string>('verifyproxycontract', compact({ address, expectedimplementation }));
    },

    /**
     * Checks the status of a proxy-contract verification request. As with
     * `checkverifystatus`, a pending or failed verification rejects with an
     * {@link EtherscanError} whose `result` carries the status text.
     * @param guid - The GUID returned by `verifyproxycontract`
     */
    checkproxyverification(guid: string): Promise<EtherscanResponse<string>> {
      return call<string>('checkproxyverification', { guid });
    },
  };
}
