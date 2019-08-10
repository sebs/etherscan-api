import { ApiKey } from '../entities/Apikey'

export interface IEntity {
  validate(): void
  valid(): boolean
}

export interface IClientRequest {
  module: string
  action: string
  apiKey: ApiKey
}
