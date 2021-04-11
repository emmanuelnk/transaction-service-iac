import * as cdk from '@aws-cdk/core'
import { config } from './config'
import { camelize } from './utils/utils'
import { DefaultVPC } from './constructs/vpc'
import { ApiGatewayRestApi } from './constructs/apigw'
import { ApiRestProducer, EventBridgeConsumers } from './constructs/lambda'
import { EventBridgeRules } from './constructs/eventbridge'


export class TransactionServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    const prefix = config.projectName
    
    // VPC -- fetch the default VPC
    const defaultVPC = new DefaultVPC(this)

    // Lambda -- to be used in rest api
    const { handler } = new ApiRestProducer(this, {
      prefix,
      vpc: defaultVPC.vpc,
      secretName: `${camelize(config.projectName)}/transaction_service/api_key` 
    })

    // ApiGateway -- create a Lambda REST API
    new ApiGatewayRestApi(this, { 
      prefix,
      vpc: defaultVPC.vpc,
      handler,
    })

    // Lambda -- create consumer Lambdas for EventBridge events
    const { consumerFunctions } = new EventBridgeConsumers(this, {
      prefix,
      vpc: defaultVPC.vpc,
    })

    // EventBridge -- create EventBridge rules for consumer functions
    new EventBridgeRules(this, {
      consumerFunctions,
      dlqMessageMaxAgeHours: 12,
      dlqRetryAttempts: 20
    })
  }
}
