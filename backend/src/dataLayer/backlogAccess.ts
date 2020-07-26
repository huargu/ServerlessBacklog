import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { IBacklog } from '../models/IBacklog'
import { IBacklogUpdate } from '../models/IBacklogUpdate'

import { config } from '../common'
import { createLogger } from "../utils/logger"

const logger = createLogger('backlogAccess')

export class BacklogAccess {
    constructor (
        private readonly dbClient: DocumentClient = createDynamoDBClient(),
        private readonly backlogTable = config.backlogsTableName,
        private readonly backlogTableIndex = config.backlogsTableIndexName
    ) { }

    async createBacklog(bitem: IBacklog): Promise<IBacklog> {
        try {
            logger.debug(`Creating Backlog:${bitem.itemName}`)
            await this.dbClient.put({
                TableName: this.backlogTable,
                Item: bitem
            }).promise()

            logger.debug(`Created backlog:${bitem.itemName}`)
            return bitem
        } catch (error) {
            logger.error(`Backlog Create Error:${error}`)
            return Promise.reject(error)
        }
    }

    async getBacklog(backlogId: string) : Promise<IBacklog> {
        try {
            logger.debug(`Getting Backlog:${backlogId}`)
            const result = await this.dbClient.query({
                TableName: this.backlogTable,
                IndexName: this.backlogTableIndex,
                KeyConditionExpression: 'backlogId = :backlogId',
                ExpressionAttributeValues: {
                    ':backlogId' : backlogId
                }
            }).promise()

            logger.debug(`Got Backlog:${backlogId}`)
            if (result && result.Items && result.Items.length) {
                return Promise.resolve(result.Items[0] as IBacklog)
            }

            return Promise.resolve(null)
        } catch (error) {
            logger.error(`Backlog get Error:${error}`)
            return Promise.reject(error)
        }
    }

    async getSprintBacklogs(sprint: string, userId: string): Promise<IBacklog[]> {
        try {
            logger.debug(`Getting sprint Backlogs:${sprint}`)
            const result = await this.dbClient.query({
                TableName: this.backlogTable,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId' : userId
                }
            }).promise()
            const results = await Promise.resolve(result.Items as IBacklog[])
            const filteredResults = results.filter(backlog => backlog.sprint === sprint)
            logger.debug(`Got sprint backlogs:${sprint}`)
            return filteredResults
        } catch (error) {
            logger.error(`Backlog Create Error:${error}`)
            return Promise.reject(error)
        }
    }


    async deleteBacklog(backlogId: string, userId: string) : Promise<boolean> {
        try {
            logger.debug(`Deleting Backlog:${backlogId}`)
            await this.dbClient.delete({
                TableName: this.backlogTable,
                Key: {
                    "backlogId": backlogId,
                    "userId": userId
                }
            }).promise()

            logger.debug(`Deleted Backlog:${backlogId}`)
            return Promise.resolve(true)
        } catch (error) {
            logger.error(`Backlog Create Error:${error}`)
            return Promise.reject(error)
        }
    }

    async updateBacklog(backlogId: string, item: IBacklogUpdate): Promise<IBacklogUpdate> {
        try {
            logger.debug(`Updating Backlog:${backlogId}`)
            const result = await this.dbClient.update({
                TableName: this.backlogTable,
                Key: {
                    "userId": item.userId,
                    "backlogId": backlogId
                },
                UpdateExpression: "SET #sprintToUpdate = :newSprint",
                ExpressionAttributeNames: {
                    '#sprintToUpdate': 'sprint',
                },
                ExpressionAttributeValues: {
                    ':newSprint': item.sprint
                },
                ReturnValues: "UPDATED_NEW"
            }).promise()

            logger.debug(`Updated Backlog:${backlogId}`)
            return Promise.resolve(result.Attributes as IBacklogUpdate)
        } catch (error) {
            logger.error(`Update Backlog Error:${error}`)
            return Promise.reject(error)
        }
    }
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        return new XAWS.DynamoDB.DocumentClient({
            region: "localhost",
            endpoint: "http://localhost:8000"
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}