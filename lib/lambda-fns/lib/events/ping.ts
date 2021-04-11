import { success, serverError } from '../responses'

export default () => {
  try {
    return success(JSON.stringify({ message: 'Everything is good!' }))
  } catch (error) {
    const body = error.stack || JSON.stringify(error, null, 2)
    
    return serverError(JSON.stringify(body))
  }
}
