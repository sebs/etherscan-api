
// base class for entities
export abstract class EntityBase {
    protected value: any
    // basic error message for exceptions on validations
    errorMessage: string
    // checks valid() and throws errorMessage
    constructor(value: any) {
        this.value = value
        this.errorMessage = 'invalid value'
    }
    validate(): void {
        if (!this.valid()) {
            throw new Error(this.errorMessage)
        }
    }

    toString(): string {
        return this.value.toString()
    }

    valid(): boolean {
        return true
    }
}
