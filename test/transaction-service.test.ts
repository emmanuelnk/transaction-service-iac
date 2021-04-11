import {
  expect as expectCDK,
  matchTemplate,
  MatchStyle,
  countResources,
  haveResource,
  haveResourceLike,
} from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import * as TransactionService from '../lib'
import { config } from '../lib/config'

test('Lambda REST API Producer Function Created', () => {
  const app = new cdk.App()
  // WHEN
  const stack = new TransactionService.TransactionServiceStack(
    app,
    'MyTestStack',
    { env: config.stack }
  )
  // THEN
  expectCDK(stack).to(
    haveResourceLike('AWS::Lambda::Function', {
      Handler: 'api-producer.handler',
      Runtime: 'nodejs12.x',
      Timeout: 30,
      MemorySize: 256,
    })
  )
})

for(const consumerName of ['deposit', 'us-deposit', 'ca-deposit', 'withdrawal' ])
  test(`${consumerName} Consumer Lambda Function Created`, () => {
    const app = new cdk.App()
    // WHEN
    const stack = new TransactionService.TransactionServiceStack(app, 'MyTestStack', { env: config.stack })
    // THEN
    expectCDK(stack).to(
      haveResourceLike('AWS::Lambda::Function', {
        Handler: `${consumerName}.handler`,
        Runtime: 'nodejs12.x',
        Timeout: 30,
        MemorySize: 256,
      })
    )
  })

test('Deposit Consumer EventBridge Rule Created', () => {
  const app = new cdk.App()
  // WHEN
  const stack = new TransactionService.TransactionServiceStack(app, 'MyTestStack', { env: config.stack })
  // THEN
  expectCDK(stack).to(
    haveResourceLike('AWS::Events::Rule', {
      Description: 'Executes deposit transactions for any location except US, CA',
      EventPattern: {
        source: ['transaction_api'],
        'detail-type': ['transaction'],
        detail: {
          action: ['deposit'],
          location: [{
            'anything-but': ['US', 'CA']
          }]
        },
      },
      State: 'ENABLED',
    })
  )
})

test('US Deposit Consumer EventBridge Rule Created', () => {
  const app = new cdk.App()
  // WHEN
  const stack = new TransactionService.TransactionServiceStack(app, 'MyTestStack', { env: config.stack })
  // THEN
  expectCDK(stack).to(
    haveResourceLike('AWS::Events::Rule', {
      Description: 'Executes deposit transactions for the US',
      EventPattern: {
        source: ['transaction_api'],
        'detail-type': ['transaction'],
        detail: {
          action: ['deposit'],
          location: ['US']
        },
      },
      State: 'ENABLED',
    })
  )
})

test('CA Deposit Consumer EventBridge Rule Created', () => {
  const app = new cdk.App()
  // WHEN
  const stack = new TransactionService.TransactionServiceStack(app, 'MyTestStack', { env: config.stack })
  // THEN
  expectCDK(stack).to(
    haveResourceLike('AWS::Events::Rule', {
      Description: 'Executes deposit transactions for CA',
      EventPattern: {
        source: ['transaction_api'],
        'detail-type': ['transaction'],
        detail: {
          action: ['deposit'],
          location: ['CA']
        },
      },
      State: 'ENABLED',
    })
  )
})

test('Withdrawal Consumer EventBridge Rule Created', () => {
  const app = new cdk.App()
  // WHEN
  const stack = new TransactionService.TransactionServiceStack(app, 'MyTestStack', { env: config.stack })
  // THEN
  expectCDK(stack).to(
    haveResourceLike('AWS::Events::Rule', {
      Description: 'Executes withdrawal transactions for any location',
      EventPattern: {
        source: ['transaction_api'],
        'detail-type': ['transaction'],
        detail: {
          action: ['withdrawal']
        },
      },
      State: 'ENABLED',
    })
  )
})

test('API Gateway Proxy Created', () => {
  const app = new cdk.App()
  // WHEN
  const stack = new TransactionService.TransactionServiceStack(app, 'MyTestStack', { env: config.stack })
  // THEN
  expectCDK(stack).to(
    haveResourceLike('AWS::ApiGateway::Resource', {
      PathPart: '{proxy+}',
    })
  )
})
