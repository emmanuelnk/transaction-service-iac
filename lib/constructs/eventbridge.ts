import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as events from '@aws-cdk/aws-events'
import * as events_targets from '@aws-cdk/aws-events-targets'
import * as sqs from '@aws-cdk/aws-sqs'
import { config } from '../config'

interface EventBridgeRulesProps {
  consumerFunctions: Record<string, lambda.IFunction>
  dlqRetryAttempts: number
  dlqMessageMaxAgeHours: number
}

const eventBridgeConsumerRules: Record<string, events.RuleProps> = {
  'deposit': {
    ruleName: `${config.projectName}-all-deposit`,
    description: 'Executes deposit transactions for any location except US, CA',
    enabled: true,
    eventPattern: {
      source: ['transaction_api'],
      detailType: ['transaction'],
      detail: {
        action: ['deposit'],
        location: [{
          'anything-but': ['US', 'CA']
        }]
      }
    }
  },
  'us.deposit': {
    ruleName: `${config.projectName}-us-deposit`,
    description: 'Executes deposit transactions for the US',
    enabled: true,
    eventPattern: {
      source: ['transaction_api'],
      detailType: ['transaction'],
      detail: {
        action: ['deposit'],
        location: ['US']
      }
    }
  },
  'ca.deposit': {
    ruleName: `${config.projectName}-ca-deposit`,
    description: 'Executes deposit transactions for CA',
    enabled: true,
    eventPattern: {
      source: ['transaction_api'],
      detailType: ['transaction'],
      detail: {
        action: ['deposit'],
        location: ['CA']
      }
    }
  },
  'withdrawal': {
    ruleName: `${config.projectName}-all-withdrawal`,
    description: 'Executes withdrawal transactions for any location',
    enabled: true,
    eventPattern: {
      source: ['transaction_api'],
      detailType: ['transaction'],
      detail: {
        action: ['withdrawal'],
      }
    }
  }
}

export class EventBridgeRules {
  constructor(scope: cdk.Construct, props: EventBridgeRulesProps) {

    for(const [key, consumerFunction] of Object.entries(props.consumerFunctions)) {
      if(!eventBridgeConsumerRules[key]) continue
      
      const eventBridgeRule = new events.Rule(scope, `${key}EventBridgeRule`, eventBridgeConsumerRules[key])

      eventBridgeRule.addTarget(new events_targets.LambdaFunction(consumerFunction, {
        deadLetterQueue: new sqs.Queue(scope, `${key}-dlq`, { queueName: `${key}.dlq` }),
        retryAttempts: props.dlqRetryAttempts,
        maxEventAge: cdk.Duration.hours(props.dlqMessageMaxAgeHours)
      }))
    }
  }
}

