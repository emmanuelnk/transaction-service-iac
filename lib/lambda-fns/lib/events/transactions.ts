import * as AWS from 'aws-sdk'
import {
  EventSource,
  EventBusName,
  EventDetail,
  EventDetailType,
  EventDetailAction,
  EventDetailStatus,
  TransactionsEventBridgeEvent,
} from './interfaces'

const eventbridge = new AWS.EventBridge()

const getLocationApproval = async (location: string): Promise<EventDetailStatus> => {
  const autoApprovedLocations = ['US', 'CA', 'UK']
  const autoRefusedLocations = ['CN', 'HK', 'TW']

  if(autoApprovedLocations.includes(location)) return EventDetailStatus.APPROVED
  if(autoRefusedLocations.includes(location)) return EventDetailStatus.REFUSED

  return EventDetailStatus.PENDING
}

export const deposit = async (params: Record<string, any>): Promise<AWS.EventBridge.PutEventsResponse> => {
  const eventDetail: EventDetail = {
    action: EventDetailAction.DEPOSIT,
    location: params.location,
    amount: params.amount,
    status: await getLocationApproval(params.location),
    cardNumber: params.cardNumber,
    bankId: params.bankId
  }

  const event: TransactionsEventBridgeEvent = {
    Source: EventSource.API,
    EventBusName: EventBusName.DEFAULT,
    DetailType: EventDetailType.TRANSACTION,
    Time: new Date(),
    Detail: JSON.stringify(eventDetail),
  }

  return eventbridge.putEvents({ Entries: [event] }).promise()
}

export const withdrawal = async (params: Record<string, any>): Promise<AWS.EventBridge.PutEventsResponse> => {
  const eventDetail: EventDetail = {
    action: EventDetailAction.WITHDRAWAL,
    location: params.location,
    amount: params.amount,
    status: await getLocationApproval(params.location),
    cardNumber: params.cardNumber,
    bankId: params.bankId
  }

  const event: TransactionsEventBridgeEvent = {
    Source: EventSource.API,
    EventBusName: EventBusName.DEFAULT,
    DetailType: EventDetailType.TRANSACTION,
    Time: new Date(),
    Detail: JSON.stringify(eventDetail),
  }

  return eventbridge.putEvents({ Entries: [event] }).promise()
}
