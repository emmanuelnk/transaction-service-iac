import * as cdk from '@aws-cdk/core'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as lambda from '@aws-cdk/aws-lambda'
import * as apigw from '@aws-cdk/aws-apigateway'
import { camelize } from '../utils/utils'

interface Props {  
  prefix: string
  vpc: ec2.IVpc
  handler: lambda.IFunction
}

/**
 * Creates a new Api gateway endpoint for the lambda rest api (proxied endpoints)
 *
 * @param  {cdk.Construct} scope stack application scope
 * @param  {StackProps} props props needed to create the resource
 *
 */
export class ApiGatewayRestApi {
  public readonly apiKey: string

  constructor(scope: cdk.Construct, props: Props) {
    // create a new api gateway LambdaRestApi and associate a lambda function with it
    new apigw.LambdaRestApi(
      scope,
      `${props.prefix}-lambda-rest-api`,
      {
        restApiName: camelize(`${props.prefix}LambdaRestApi`),
        handler: props.handler,
        defaultCorsPreflightOptions: {
          allowMethods: apigw.Cors.ALL_METHODS,
          allowOrigins: apigw.Cors.ALL_METHODS
        }
      }
    )
  }
}
