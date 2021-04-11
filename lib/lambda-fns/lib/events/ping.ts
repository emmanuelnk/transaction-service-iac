import { success, serverError } from '../responses'

export default () => {
  try {
    return success('Everything is good!')
  } catch (error) {
    const body = error.stack || JSON.stringify(error, null, 2)
    
    return serverError(body)
  }
}
