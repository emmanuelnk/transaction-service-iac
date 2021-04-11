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

## Pre-requisites for Local Testing and Deploy
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
## Testing
- You can run the test suite (inside `./test/`) included with the stack with
```
npm test
```
## Deploy from Local  
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
- Deployment pipeline via Github Actions (see `.github/workflows/deploy.yml`)
- To deploy to stage `dev`, merge/push to `dev` branch
- To deploy to stage `prod`, merge/push to `prod` branch

### Destroy the stack
- to destroy the stack and remove all created resources simply run
  ```
  cdk destroy --profile default
  ```

### Sample Event
```json
// POST https://liz92p0to8.execute-api.us-west-2.amazonaws.com/prod/transaction/deposit
// HEADER x-api-key xxxxxXXXxXXxXXXXXxxx
{
    "location": "US",
    "amount": 45,
    "cardNumber": 45566541332646,
    "bankId": 4052
}
```
  
