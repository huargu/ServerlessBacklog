const backlogsTableName = process.env.BACKLOGS_TABLE
const backlogsTableIndexName = process.env.BACKLOGS_INDEX_NAME
const sprintsTableName = process.env.SPRINTS_TABLE
const sprintsTableIndexName = process.env.SPRINTS_INDEX_NAME
const isOffline = process.env.IS_OFFLINE
const jwksUrl = process.env.AUTH0_JWKS_URL

export {
    backlogsTableName,
    backlogsTableIndexName,
    sprintsTableName,
    sprintsTableIndexName,
    isOffline,
    jwksUrl
}