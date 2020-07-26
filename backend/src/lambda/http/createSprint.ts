import 'source-map-support/register'

import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { createSprint } from '../../businessLogic/sprint'

export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
  try  {
    const newItem = await createSprint()
  
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ item: newItem })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    }
  }
}
