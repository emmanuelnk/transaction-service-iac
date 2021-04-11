# Transaction Service IaC

This is a CDK project to create AWS IaC for a fake Transaction project.

## What does it do ?
- Transaction service receives either `deposit` or `withdrawal` events via http `POST` to API gateway AWS Lambda producer function
- These events are sent to AWS EventBridge where they are then re-routed based on EventBridge rules to specific consumer lambda functions
- If these Lambda functions are successful then they just log a success message
- If these Lambda functions fail, then the event is sent to a deadLetterQueue to be re-tried

## The stack

![transaction_api](https://user-images.githubusercontent.com/19330930/114302479-d40ca780-9afb-11eb-9833-97d166ed93cd.png)

Consists of:
- Default region VPC
- Two Lambda REST API Gateway endpoints
  - POST /transaction/deposit
  - POST /transaction/withdrawal
- An API Gateway triggered Lambda function that puts events in EventBridge
- Four consumer Lambda functions that consume events from EventBridge based on different rules
- A dead letter queue for each of the consumer Lambda functions for events that fail

## Deploy from Local
### Pre-requisites
- Ensure you have a `.env` file if you want to dpeloy from local (see `.env.example`)
- Make sure you have `.aws/credentials` file. This is what it looks like:
  ```
  [default]
  aws_access_key_id=xxxXXXXXXXxxxXXxxxx
  aws_secret_access_key=xxxXXXXXXXxxxXXxxxx
  ```
- And a `.aws/config` file:
  ```
  [default]
  region=us-west-2
  output=json
  ``` 
  
### Synth
- To view/generate the CloudFormation template
  ```
  cdk synth --profile default
  ```
### Deploy
- To deploy the stack
  ```
  cdk deploy --profile default
  ```
## Deploy via CI/CD (Github Actions)
- Deployment pipeline via Github Actions
- To deploy to stage `dev`, merge/push to `dev` branch
- To deploy to stage `prod`, merge/push to `prod` branch
  
