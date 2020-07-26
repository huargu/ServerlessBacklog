import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteSprint } from '../../businessLogic/sprint'
import { getSprintItem } from '../../businessLogic/sprint'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const sprintId = event.pathParameters.sprintId

    if (sprintId) {
      const sprintItem = await getSprintItem(sprintId)

      if (!sprintItem) {
        return {
          statusCode : 404,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({message: 'Sprint not found'})
        }
      }

      await deleteSprint(sprintId)

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
