
// base class for entities
export abstract class EntityBase {
    // basic error message for exceptions on validations
    errorMessage: string
    // checks valid() and throws errorMessage
    constructor() {
        this.errorMessage = 'invalid value'
    }
    validate(): void {
        if (!this.valid()) {
            throw new Error(this.errorMessage)
        }
    }

    valid(): boolean {
        return true
    }
}
