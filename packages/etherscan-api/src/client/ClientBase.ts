import * as request from 'request-promise-native'

/**
 * Basic functions shared by all clients
 */
export class ClientBase {
  /**
   * Creates the request url
   */
  toUrl(): string {
    return ''
  }
  /**
   * Dies the actual request to the server
   */
  async request(): Promise<any> {
    const options = {
      uri: this.toUrl(),
    }
    return request.get(options)
  }
  /**
   * Processes the result and return it
   * @param result String result of a request
   */
  protected processResult(result: string): object {
    return JSON.parse(result)
  }
}
