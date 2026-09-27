/** Query parameters for one request, every field present. */
export type QueryParams = Record<string, string | number | boolean>;

/** A params object whose optional fields may still be missing. */
export type LooseParams = Record<string, string | number | boolean | null | undefined>;

/**
 * Drop the fields that were not given — `undefined`, `null` and `''` — so a
 * params object can be written as one literal instead of an `if` per field.
 * `0` and `false` are kept: block 0 (genesis) and page/offset 0 are values.
 */
export function compact(params: LooseParams): QueryParams {
  const out: QueryParams = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      out[key] = value;
    }
  }
  return out;
}

/** True when an argument is an options object rather than a positional value. */
export function isOptions<T extends object>(value: unknown): value is T {
  return typeof value === 'object' && value !== null;
}
