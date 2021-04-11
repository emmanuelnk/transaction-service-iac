interface JsonResBody {
  [x: string]: any
}

export const response = (statusCode: number, body: string | JsonResBody) => {
  return { 
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    statusCode,
    body: JSON.stringify(body),
  }
}

export const success = (message: string | JsonResBody = 'Success') =>
  response(200, message)

export const unauthorized = (message: string | JsonResBody = 'Unauthorized') =>
  response(401, message)

export const forbidden = (message: string | JsonResBody = 'Forbidden') =>
  response(403, message)

export const badRequest = (message: string | JsonResBody = 'BadRequest') =>
  response(400, message)

export const notFound = (message: string | JsonResBody = 'NotFound') =>
  response(404, message)

export const serverError = (message: string | JsonResBody = 'ServerError') =>
  response(500, message)