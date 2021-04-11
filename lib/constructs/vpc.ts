import * as cdk from '@aws-cdk/core'
import * as ec2 from '@aws-cdk/aws-ec2'

/**
 * Creates a custom vpc with ISOLATED and PUBLIC subnets
 * 
 * @param  {cdk.Construct} scope stack application scope
 * @param  {StackProps} props props needed to create the resource
 * 
 */
export class DefaultVPC {
  public readonly vpc: ec2.IVpc

  constructor(scope: cdk.Construct) {
    this.vpc = ec2.Vpc.fromLookup(scope, 'VPC', { isDefault: true })
  }
}