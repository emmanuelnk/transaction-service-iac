import { EventBridgeEvent } from 'aws-lambda'

exports.handler = async (event: EventBridgeEvent<string, any>) => {
  return `[INFO] [${event.detail.action}] Event for ${event.detail.location} successfully processed`
}
