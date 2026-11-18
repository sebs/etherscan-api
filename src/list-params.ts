import { EtherscanArgumentError } from './errors.js';
import { compact } from './params.js';
import type { QueryParams } from './params.js';
import { checkPaging, checkSort } from './validation.js';
import type { SortOrder } from './validation.js';

/**
 * Advanced-filter fields (Beta) accepted by the transaction-list endpoints.
 * Filter by sender and/or recipient instead of a single `address`; Etherscan
 * rejects an address combined with `from`/`to`. Provide `from`, `to`, or both.
 * With both, `fromto_opr` is required and chooses whether both must match
 * (`'and'`) or either (`'or'`); with one, it defaults to `'or'`, the only
 * value Etherscan accepts there.
 * @see https://docs.etherscan.io/api-reference/endpoint/advanced-filter-txlist
 */
export interface AdvancedFilter {
  /** Sender address to filter by. */
  from?: string;
  /** Recipient address to filter by. */
  to?: string;
  /**
   * Operator between `from` and `to`: `'and'` (both match) or `'or'` (either).
   * Required when both are set; defaults to `'or'` when only one is.
   */
  fromto_opr?: 'and' | 'or';
}

/**
 * Options shared by the paged list endpoints. Every field is optional; the
 * defaults are the whole chain (block 0 to latest), page 1, 100 records per
 * page, ascending.
 */
export interface ListOptions {
  /** First block to include (default `0`). */
  startblock?: string | number;
  /** Last block to include (default `'latest'`). */
  endblock?: string | number;
  /** Page number, from 1 (default `1`). `page × offset` may not exceed 10 000. */
  page?: number;
  /** Records per page (default `100`). */
  offset?: number;
  /** Sort by block: `'asc'` (default) or `'desc'`. */
  sort?: SortOrder;
}

/** {@link ListOptions} plus an advanced filter (Beta) on sender/recipient. */
export interface FilteredListOptions extends ListOptions {
  /** Filter by `from`/`to` instead of an address (Etherscan rejects the two combined). */
  filter?: AdvancedFilter;
}

/** The list arguments of the deprecated positional call forms, in their historical order. */
export type PositionalList = [
  startblock?: string | number,
  endblock?: string | number,
  page?: number,
  offset?: number,
  sort?: SortOrder,
];

/** {@link PositionalList} plus the trailing advanced filter. */
export type PositionalFilteredList = [...PositionalList, filter?: AdvancedFilter];

/** Read the deprecated positional list arguments into options. */
export function fromPositional([startblock, endblock, page, offset, sort, filter]: PositionalFilteredList): FilteredListOptions {
  return { startblock, endblock, page, offset, sort, filter };
}

/**
 * The advanced-filter params, checked against Etherscan's rules (verified
 * live): `from`/`to` cannot be combined with an `address`, `fromto_opr` is
 * required once either is set, and `'and'` needs both. With one side and no
 * operator, `'or'` is filled in, as the only value Etherscan accepts.
 * @param address - The address the request also sends, if any.
 * @throws {EtherscanArgumentError} For a combination Etherscan would reject.
 */
export function filterParams(filter?: AdvancedFilter, address?: string): QueryParams {
  const params = filter ? compact({ from: filter.from, to: filter.to, fromto_opr: filter.fromto_opr }) : {};
  const sides = Number(params.from !== undefined) + Number(params.to !== undefined);
  if (sides === 0) return params;
  if (address) {
    throw new EtherscanArgumentError(
      'An advanced filter on from/to cannot be combined with an address; pass one or the other',
      'filter',
      filter,
    );
  }
  if (params.fromto_opr === undefined) {
    if (sides === 2) {
      throw new EtherscanArgumentError(
        "A filter on both from and to needs fromto_opr: 'and' (both match) or 'or' (either)",
        'fromto_opr',
      );
    }
    params.fromto_opr = 'or';
  } else if (params.fromto_opr === 'and' && sides === 1) {
    throw new EtherscanArgumentError(
      "fromto_opr 'and' needs both from and to; use 'or' to filter on one side",
      'fromto_opr',
      'and',
    );
  }
  return params;
}

/**
 * Paging params, validated: positive integers and, with `window`, within
 * Etherscan's 10 000-record result window.
 *
 * Etherscan pages only when it gets both `page` and `offset`; either one alone
 * is ignored and the unpaged result comes back (checked live). So once either
 * is given, or with `defaults`, the missing one is filled in as page 1 / 100
 * records. With neither given and no `defaults`, both are left out so
 * Etherscan's unpaged result applies.
 * @throws {EtherscanArgumentError} For invalid paging.
 */
export function pagingParams(
  page: number | undefined,
  offset: number | undefined,
  { defaults = false, window = true } = {},
): QueryParams {
  if (!defaults && page === undefined && offset === undefined) return {};
  const p = page ?? 1;
  const o = offset ?? 100;
  checkPaging(p, o, window);
  return { page: p, offset: o };
}

/** The block range, defaulting to the whole chain. */
export function blockRange(startblock?: string | number, endblock?: string | number): QueryParams {
  return { startblock: startblock ?? 0, endblock: endblock ?? 'latest' };
}

/**
 * The full, validated params of a paged list query: block range, paging with
 * defaults, sort and filter.
 * @param address - The address the request also sends, if any (see {@link filterParams}).
 * @throws {EtherscanArgumentError} For an invalid sort, paging or filter.
 */
export function listParams(options: FilteredListOptions, address?: string): QueryParams {
  return {
    ...blockRange(options.startblock, options.endblock),
    ...pagingParams(options.page, options.offset, { defaults: true }),
    sort: checkSort(options.sort),
    ...filterParams(options.filter, address),
  };
}
