import { compact } from './params.js';
import type { QueryParams } from './params.js';
import { checkPaging, checkSort } from './validation.js';
import type { SortOrder } from './validation.js';

/**
 * Advanced-filter fields (Beta) accepted by the transaction-list endpoints.
 * Filter by sender and/or recipient instead of a single `address`. Provide
 * `from`, `to`, or both; `fromto_opr` chooses whether both must match
 * (`'and'`) or either (`'or'`).
 * @see https://docs.etherscan.io/api-reference/endpoint/advanced-filter-txlist
 */
export interface AdvancedFilter {
  /** Sender address to filter by. */
  from?: string;
  /** Recipient address to filter by. */
  to?: string;
  /** Operator between `from` and `to`: `'and'` (both match) or `'or'` (either). */
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
  /** Filter by `from`/`to`, in addition to or instead of an address. */
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

/** The advanced-filter params that were given. */
export function filterParams(filter?: AdvancedFilter): QueryParams {
  return filter ? compact({ from: filter.from, to: filter.to, fromto_opr: filter.fromto_opr }) : {};
}

/**
 * Paging params, validated: positive integers and, with `window`, within
 * Etherscan's 10 000-record result window. With `defaults`, a missing page or
 * offset becomes 1 / 100; without, it is left out so Etherscan's own default
 * (usually the unpaged result) applies.
 * @throws {EtherscanArgumentError} For invalid paging.
 */
export function pagingParams(
  page: number | undefined,
  offset: number | undefined,
  { defaults = false, window = true } = {},
): QueryParams {
  const p = page ?? (defaults ? 1 : undefined);
  const o = offset ?? (defaults ? 100 : undefined);
  if (p !== undefined || o !== undefined) {
    checkPaging(p ?? 1, o ?? 1, window);
  }
  return compact({ page: p, offset: o });
}

/** The block range, defaulting to the whole chain. */
export function blockRange(startblock?: string | number, endblock?: string | number): QueryParams {
  return { startblock: startblock ?? 0, endblock: endblock ?? 'latest' };
}

/**
 * The full, validated params of a paged list query: block range, paging with
 * defaults, sort and filter.
 * @throws {EtherscanArgumentError} For an invalid sort or paging.
 */
export function listParams(options: FilteredListOptions): QueryParams {
  return {
    ...blockRange(options.startblock, options.endblock),
    ...pagingParams(options.page, options.offset, { defaults: true }),
    sort: checkSort(options.sort),
    ...filterParams(options.filter),
  };
}
