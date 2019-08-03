export abstract class EntityBase {
	public errorMessage: string
	validate(): void {
		if (!this.valid()) {
			throw new Error(this.errorMessage)
		}
	}

	valid():boolean {
		return true
	}
}