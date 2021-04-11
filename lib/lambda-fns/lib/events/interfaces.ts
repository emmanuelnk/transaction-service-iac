export enum EventSource {
  API = 'transaction_api' 
}

export enum EventBusName {
  DEFAULT = 'default'
}

export enum EventDetailType {
  TRANSACTION = 'transaction'
}

export enum EventDetailAction {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal'
}

export enum EventDetailStatus {
  APPROVED = 'approved',
  REFUSED = 'refused',
  PENDING = 'pending',
}

export interface EventDetail {
  action: EventDetailAction
  location: string
  amount: number
  status: EventDetailStatus
  cardNumber: number
  bankId: string
}

export interface TransactionsEventBridgeEvent {
  Source: EventSource
  EventBusName: EventBusName
  DetailType: EventDetailType
  Time: Date,
  Detail: string
}
