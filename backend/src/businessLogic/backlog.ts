import { CreateBacklogRequest } from '../requests/CreateBacklogRequest'
import { UpdateBacklogRequest } from '../requests/UpdateBacklogRequest'

import { BacklogAccess } from '../dataLayer/backlogAccess'

import { IBacklog } from '../models/IBacklog'
import { IBacklogUpdate } from '../models/IBacklogUpdate'

import * as uuid from 'uuid'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { getUserId } from '../lambda/utils'

const dbAccess = new BacklogAccess()
import { createLogger } from "../utils/logger"

const logger = createLogger('backlogBL')

export const createBacklog = async(request: CreateBacklogRequest, event: APIGatewayProxyEvent): Promise<IBacklog> => {
    const backlogId = uuid.v4()
    const userId = getUserId(event)
    logger.debug('backlogid:' + backlogId)
    logger.debug('userid:' + userId)
    const item = {
        userId: userId,
        backlogId: backlogId,
        createdAt: new Date().toISOString(),
        itemName: request.itemName,
        done: false,
        sprint: '0'
    } as IBacklog

    return await dbAccess.createBacklog(item)
}

export const getBacklogItem = async(backlogId: string): Promise<IBacklog> => {
    return await dbAccess.getBacklog(backlogId)
}

export const getSprintBacklogItems = async(sprint: string, event: APIGatewayProxyEvent) : Promise<IBacklog[]> => {
    const userId = getUserId(event)
    return await dbAccess.getSprintBacklogs(sprint, userId)
}

export const deleteBacklog = async(backlogId: string, event: APIGatewayProxyEvent) : Promise<boolean> => {
    const userId = getUserId(event)
    return await dbAccess.deleteBacklog(backlogId, userId)
}

export const updateBacklog = async (backlogId: string, request: UpdateBacklogRequest, event: APIGatewayProxyEvent) : Promise<IBacklogUpdate> => {
    const userId = getUserId(event)
    const item = {
        sprint: request.sprint,
        userId: userId
    }
    return await dbAccess.updateBacklog(backlogId, item)
}