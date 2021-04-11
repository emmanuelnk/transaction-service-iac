import { 
  deposit as depositTransaction, 
  withdrawal as withdrawalTransaction 
} from './events/transactions'

export const protectedRoutes: Record <string, any> = {
  '/transaction/deposit': {
    POST: depositTransaction
  },
  '/transaction/withdrawal': {
    POST: withdrawalTransaction
  }
}