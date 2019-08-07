
// base class for entities
export abstract class EntityBase {
	// basic error message for exceptions on validations
	public errorMessage: string
	// checks valid() and throws errorMessage
	validate(): void {
		if (!this.valid()) {
			throw new Error(this.errorMessage)
		}
	}

	valid():boolean {
		return true
	}
}