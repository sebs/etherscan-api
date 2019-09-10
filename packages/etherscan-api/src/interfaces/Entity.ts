/**
 * Basic Interface for an entitiy
 */
export interface IEntity {
  /**
   * Validatees a entitiy and throws on error
   */
  validate(): void
  /**
   * Checks validity
   */
  valid(): boolean
}
