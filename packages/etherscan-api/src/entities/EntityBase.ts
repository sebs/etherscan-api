
/**
 * base class for entities
 */
export abstract class EntityBase {
    /**
     * Value of the entity
     */
    protected value: any
    /**
     * Basic error message for exceptions on validations
     */
    protected errorMessage: string

    constructor(value: any) {
        this.value = value
        this.errorMessage = 'invalid value'
    }
    /**
     * checks valid() and throws errorMessage
     */
    validate(): void {
        if (!this.valid()) {
            throw new Error(this.errorMessage)
        }
    }
    /**
     *  converts the entity to a string
     */
    toString(): string {
        return this.value.toString()
    }
    /**
     * validates the entity
     */
    valid(): boolean {
        return true
    }
}
