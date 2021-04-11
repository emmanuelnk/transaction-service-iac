import * as dotenv from 'dotenv'

dotenv.config()

const stage = process.env.STAGE || 'dev'

export const config = {
    projectName: `transaction-service-${stage}`,   
    stage,
    stack: {        
        account: process.env.AWS_ACCOUNT_NUMBER,
        region: process.env.AWS_REGION || 'us-west-2'
    },
    deployedBy: process.env.DEPLOYED_BY || process.env.USER || 'github.actions.bot',
}