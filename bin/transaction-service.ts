#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { TransactionServiceStack } from '../lib'
import { config } from '../lib/config'

const app = new cdk.App()
new TransactionServiceStack(app, 'TransactionServiceStack', {
  env: config.stack,
  description: `Transaction Service API ${config.stage} resources`,
  tags: { Project: config.projectName, Deployedby: config.deployedBy } 
})