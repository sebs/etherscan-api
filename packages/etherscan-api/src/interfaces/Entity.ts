export interface IEntity {
  validate(): void
  valid(): boolean
}

export interface IClientRequest {
  module: string
  action: string
}

export interface IClientAccountBalanceRequest extends IClientRequest {
  address: string
  tag: string
  apiKey: string
}

export interface IClientAccountBalanceMultiRequest extends IClientRequest {
  address: string
  tag: string
  apiKey: string
}

export interface IClientAccountTxlistRequest extends IClientRequest {
  address: string
  startblock: string
  endblock: string
  page?: string
  offset?: string
  sort?: string
}
export interface IClientAccountTxlistInternalRequest extends IClientAccountTxlistRequest {
  txhash: string
}

export interface IClientAccountTokentx extends IClientRequest {
  contractaddress: string
  startblock?: string
  endblock?: string
  page?: string
  offset?: string
  sort?: string
}
