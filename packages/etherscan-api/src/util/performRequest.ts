import { Network } from '../entities/Network'
import { requestUrlBuilder } from '../requestUrlBuilder'

export const performRequest = (
    network: Network,
    module: string,
    action: string,
    params: any,
    timeout: number = 3000) => {

    const url = requestUrlBuilder(
        network,
        module,
        action,
        params,
    )
    const timer = new Promise((resolve) => {
        setTimeout(resolve, timeout, {
          timeout: true,
        })
    })
    return Promise.race([
        fetch(url),
        timer,
     ]).then((response: any)  => {
         if (response.timeout) {
            throw new Error('Request timeout')
         }
         return response
     }).then((response: any)  => {
        if (response.status === 500) {
           throw new Error('Internal server error')
        }
        return response
     })
}
