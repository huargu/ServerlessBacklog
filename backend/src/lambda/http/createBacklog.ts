import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateBacklogRequest } from '../../requests/CreateBacklogRequest'
import { createBacklog } from '../../businessLogic/backlog'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try  {
    const newBacklog: CreateBacklogRequest = JSON.parse(event.body)
  
    const newItem = await createBacklog(newBacklog, event)
  
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
