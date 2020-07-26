import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateBacklogRequest } from '../../requests/UpdateBacklogRequest'
import { getBacklogItem, updateBacklog } from '../../businessLogic/backlog'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  try {
    const backlogId = event.pathParameters.backlogId
    const updatedBacklog: UpdateBacklogRequest = JSON.parse(event.body)

    if (backlogId) {
      const backlogItem = await getBacklogItem(backlogId)

      if (!backlogItem) {
        return {
          statusCode : 404,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({message: 'Sprint not found'})
        }
      }

      const result = await updateBacklog(backlogId, updatedBacklog, event)

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(result)
      }
    } else {
      return {
        statusCode : 400,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({message: 'Invalid sprintid'})
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
