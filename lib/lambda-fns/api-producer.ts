import { APIGatewayProxyEvent } from 'aws-lambda'
import ping from './lib/events/ping'
import { notFound, forbidden } from './lib/responses'
import { apiKeyCompare } from './lib/utils'
import { protectedRoutes } from './lib/routes'

exports.handler = async (event: APIGatewayProxyEvent) => {
  // public
  if(event.path === '/ping')
    return ping()

  if(!(await apiKeyCompare(event.headers['x-api-key'])))
    return forbidden('BadApiKey')

  // protected
  if(!protectedRoutes[event.path][event.httpMethod])
    return notFound('RouteNotFound') 
  
  return protectedRoutes[event.path][event.httpMethod](event)
}
