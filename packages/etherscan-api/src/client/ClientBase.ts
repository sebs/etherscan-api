/**
 * Basic functions shared by all clients
 */
export class ClientBase {
  /**
   * Creates a URL for the API
   */
  toUrl(): string {
    return ''
  }

  /**
   * Dies the actual request to the server
   */
  async request(): Promise<any> {
    return fetch(this.toUrl()).then((response: any) => response.json())
  }
  /**
   * Processes the result and return it
   * @param result String result of a request
   */
  protected processResult(result: string): object {
    return JSON.parse(result)
  }
}
