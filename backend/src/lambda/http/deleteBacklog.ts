import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getBacklogItem, deleteBacklog } from '../../businessLogic/backlog'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const backlogId = event.pathParameters.backlogId

    if (backlogId) {
      const backlogItem = await getBacklogItem(backlogId)

      if (!backlogItem) {
        return {
          statusCode : 404,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({message: 'Backlog not found'})
        }
      }

      await deleteBacklog(backlogId, event)

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: ''
      }
    } else {
      return {
        statusCode : 400,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({message: 'Invalid backlogid'})
      }
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(error)
    }
  }
}
