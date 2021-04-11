import * as lambda from '@aws-cdk/aws-lambda'
import * as cdk from '@aws-cdk/core'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as iam from '@aws-cdk/aws-iam'
import * as secrets from '@aws-cdk/aws-secretsmanager'
import { camelize } from '../utils/utils'

interface RestApiLambdaProps {
  prefix: string
  vpc: ec2.IVpc
  secretName: string
}


/**
 * Lambda function used by ApiGateway REST API to produce EventBridge events
 * 
 * @param  {cdk.Construct} scope stack application scope
 * @param  {StackProps} props props needed to create the resource
 * 
 */
export class ApiRestProducer {
    public readonly handler: lambda.IFunction

    constructor(scope: cdk.Construct, props: RestApiLambdaProps) {
      const role = new iam.Role(scope, camelize(`${props.prefix}RestApiLambdaRole`), {
          assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
          managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"),
            iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaVPCAccessExecutionRole"),
          ]
      })

      // allow lambda to put events in EventBridge
      role.addToPolicy(
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          resources: ['*'],
          actions: ['events:PutEvents']
        })
      )

      const layer = new lambda.LayerVersion(scope, `${props.prefix}-lambda-rest-api-function-layer`, {
        code: lambda.Code.fromAsset('lib/lambda-fns/layer.zip'),
        compatibleRuntimes: [lambda.Runtime.NODEJS_12_X],
        description: 'Contains node module dependencies for Lambda Rest API lambda functions'
      })


      // create new api key and store key in secrets manager
      const apiKeySecret = new secrets.Secret(
        scope,
        camelize(`${props.prefix}ApigwLambdaRestApiKey`),
        {
          secretName: props.secretName,
          description:
            'Api key for lambda rest data api in Transaction Service',
          generateSecretString: {
            excludePunctuation: true,
            includeSpace: false,
            excludeUppercase: true,
            excludeCharacters: ':/?#[]@!$&\\()*+,;="<>%{}|^`',
          },
        }
      )


      this.handler = new lambda.Function(scope, `${props.prefix}-lambda-rest-api-handler`, {
        functionName: `${props.prefix}-rest-api-handler`,
        code: lambda.Code.fromAsset('lib/lambda-fns/src'),
        layers: [layer],
        handler: 'api.producer.handler',
        runtime: lambda.Runtime.NODEJS_12_X,
        timeout: cdk.Duration.seconds(60),
        memorySize: 512,
        vpc: props.vpc,
        vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
        role,
        environment: {
          API_KEY: apiKeySecret.secretValue.toString()
        },
      })
    }
}

interface EventBridgeConsumerLambdaProps {
  prefix: string
  vpc: ec2.IVpc
}

interface ConsumerFunction extends lambda.IFunction {
  consumerName: string
}

/**
 * Creates Lambda functions that consume EventBridge events
 * 
 * @param  {cdk.Construct} scope stack application scope
 * @param  {StackProps} props props needed to create the resource
 * 
 */
 export class EventBridgeConsumers {
  public readonly consumerFunctions: Record<string, lambda.IFunction>

  constructor(scope: cdk.Construct, props: EventBridgeConsumerLambdaProps) {
    const role = new iam.Role(scope, camelize(`${props.prefix}EventBridgeConsumerLambdaRole`), {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"),
          iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaVPCAccessExecutionRole"),
        ]
    })

    const layer = new lambda.LayerVersion(scope, `${props.prefix}-eventbridge-function-layer`, {
      code: lambda.Code.fromAsset('lib/lambda-fns/layer.zip'),
      compatibleRuntimes: [lambda.Runtime.NODEJS_12_X],
      description: 'Contains node module dependencies for EventBridge consumer functions'
    })

    // create the consumer lambda functions
    this.consumerFunctions = {}

    for(const [index, consumer] of ['deposit', 'us.deposit', 'ca.deposit', 'withdrawal' ].entries()) {
      const consumerFunction = new lambda.Function(scope, `${props.prefix}-eventbridge-function-${index}-handler`, {
        functionName: `${props.prefix}-${consumer}`,
        code: lambda.Code.fromAsset('lib/lambda-fns/src/consumers'),
        layers: [layer],
        handler: `${consumer}.handler`,
        runtime: lambda.Runtime.NODEJS_12_X,
        timeout: cdk.Duration.seconds(60),
        memorySize: 256,
        vpc: props.vpc,
        vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
        role
      })

      this.consumerFunctions[consumer] = consumerFunction
    }
  }
}