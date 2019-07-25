export function mapFromArray(arr: Array<any>) {
	const map = new Map()
	arr.map(name => map.set(name, name))
	return map
}