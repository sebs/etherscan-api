import { mapFromArray } from "../util/mapFromArray"
const actionNames = [
    "getstatus",
    "gettxreceiptstatus",
]
export const transaction = mapFromArray(actionNames)
