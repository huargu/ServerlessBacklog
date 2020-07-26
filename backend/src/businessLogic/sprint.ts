import { SprintAccess } from '../dataLayer/sprintAccess'

import { ISprint } from '../models/ISprint'

const dbAccess = new SprintAccess()
import { createLogger } from "../utils/logger"

const logger = createLogger('sprintBL')

export const createSprint = async(): Promise<ISprint> => {
    logger.debug('creating sprint')
    const allSprints = await getSprints();
    logger.debug('got all sprints')
    let sprintId = 1;
    if (allSprints != null)
        logger.debug('all sprints is not null')
    if (allSprints != null)
        sprintId = allSprints.length + 1;
    
    logger.debug('sprintid' + String(sprintId))
    const item = {
        sprintId: String(sprintId),
        createdAt: new Date().toISOString()
    } as ISprint

    return await dbAccess.createSprint(item)
}

export const getSprints = async(): Promise<ISprint[]> => {
    return await dbAccess.getSprints();
}

export const getSprintItem = async(sprintId: string): Promise<ISprint> => {
    return await dbAccess.getSprint(sprintId)
}

export const deleteSprint = async(sprintId: string) : Promise<boolean> => {
    return await dbAccess.deleteSprint(sprintId)
}
