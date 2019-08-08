// easily create js maps from simple arrays
export function mapFromArray(arr: any[]) {
    const map = new Map()
    arr.map((name) => map.set(name, name))
    return map
}
