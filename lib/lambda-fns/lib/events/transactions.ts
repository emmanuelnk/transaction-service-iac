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
import { success, serverError } from '../responses'

AWS.config.region = process.env.AWS_REGION || 'us-west-2'
const eventbridge = new AWS.EventBridge()

const getLocationApproval = async (location: string): Promise<EventDetailStatus> => {
  const autoApprovedLocations = ['US', 'CA', 'UK']
  const autoRefusedLocations = ['CN', 'HK', 'TW']

  if(autoApprovedLocations.includes(location)) return EventDetailStatus.APPROVED
  if(autoRefusedLocations.includes(location)) return EventDetailStatus.REFUSED

  return EventDetailStatus.PENDING
}

export const deposit = async (params: Record<string, any>): Promise<any> => {
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

  try {
    return success(await eventbridge.putEvents({ Entries: [event] }).promise())
  } catch(err) {
    return serverError(err)
  }
}

export const withdrawal = async (params: Record<string, any>): Promise<any> => {
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

  try {
    return success(await eventbridge.putEvents({ Entries: [event] }).promise())
  } catch(err) {
    return serverError(err)
  }
}
