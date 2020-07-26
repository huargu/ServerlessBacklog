import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { ISprint } from '../models/ISprint'

import { config } from '../common'
import { createLogger } from "../utils/logger"

const logger = createLogger('sprintAccess')

export class SprintAccess {
    constructor (
        private readonly dbClient: DocumentClient = createDynamoDBClient(),
        private readonly sprintTable = config.sprintsTableName,
        private readonly sprintTableIndex = config.sprintsTableIndexName
    ) { }

    async createSprint(item: ISprint): Promise<ISprint> {
        try {
            logger.debug(`Creating Sprint:${item.sprintId}`)
            await this.dbClient.put({
                TableName: this.sprintTable,
                Item: item
            }).promise()

            logger.debug(`Created sprint:${item.sprintId}`)
            return item
        } catch (error) {
            logger.error(`Sprint Create Error:${error}`)
            return Promise.reject(error)
        }
    }

    async getSprints() : Promise<ISprint[]> {
        try {
            logger.debug(`Getting Sprints`)
            const result = await this.dbClient.scan({
                TableName: this.sprintTable,
                IndexName: this.sprintTableIndex
            }).promise()

            logger.debug(`Got Sprints`)
            if (result && result.Items && result.Items.length) {
                return Promise.resolve(result.Items as ISprint[])
            }

            return Promise.resolve(null)
        } catch (error) {
            logger.error(`Sprint get Error:${error}`)
            return Promise.reject(error)
        }
    }

    async getSprint(sprintId: string) : Promise<ISprint> {
        try {
            logger.debug(`Getting Sprint:${sprintId}`)
            const result = await this.dbClient.query({
                TableName: this.sprintTable,
                IndexName: this.sprintTableIndex,
                KeyConditionExpression: 'sprintId = :sprintId',
                ExpressionAttributeValues: {
                    ':sprintId' : sprintId
                }
            }).promise()

            logger.debug(`Got Sprint:${sprintId}`)
            if (result && result.Items && result.Items.length) {
                return Promise.resolve(result.Items[0] as ISprint)
            }

            return Promise.resolve(null)
        } catch (error) {
            logger.error(`Sprint get Error:${error}`)
            return Promise.reject(error)
        }
    }

    async deleteSprint(sprintId: string) : Promise<boolean> {
        try {
            logger.debug(`Deleting Sprint:${sprintId}`)
            await this.dbClient.delete({
                TableName: this.sprintTable,
                Key: {
                    "sprintId": sprintId
                }
            }).promise()

            logger.debug(`Deleted Sprint:${sprintId}`)
            return Promise.resolve(true)
        } catch (error) {
            logger.error(`Sprint Create Error:${error}`)
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