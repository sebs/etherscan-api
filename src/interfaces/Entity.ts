import { ApiKey } from '../entities/Apikey'

export interface IClientRequest {
  module: string
  action: string
  apiKey: ApiKey
}

export interface IEntity {
  validate(): void
  valid(): boolean
}
