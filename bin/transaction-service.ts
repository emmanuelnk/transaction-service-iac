#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { TransactionServiceStack } from '../lib/transaction-service-stack';

const app = new cdk.App();
new TransactionServiceStack(app, 'TransactionServiceStack');
