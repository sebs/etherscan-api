
// base class for entities
export abstract class EntityBase {
    // basic error message for exceptions on validations
    public errorMessage: string
    // checks valid() and throws errorMessage
    public validate(): void {
        if (!this.valid()) {
            throw new Error(this.errorMessage)
        }
    }

    public valid(): boolean {
        return true
    }
}
