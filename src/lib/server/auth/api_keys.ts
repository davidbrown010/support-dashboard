import { apiKeysTable } from "../db/api_keys/schema"
import { users } from "../db/users/schema"
import { eq } from "drizzle-orm"
import { db } from "../db/drizzle"

export const validateApiKey = async (authTokenHeader: string) => {
    const authToken = authTokenHeader.replace('Bearer ', '').replaceAll(' ', '')
    if (!authToken) return null
    
    const apiKeySelectResult = await db.select().from(apiKeysTable).where(eq(apiKeysTable.apiKey, authToken)).limit(1)
    const apiKey = apiKeySelectResult.length && apiKeySelectResult[0]

    if (!apiKey) return null
    if (apiKey.expires < (new Date()).valueOf()) return null

    const userSelectResult = await db.select().from(users).where(eq(users.id, apiKey.userId)).limit(1)
    const user = userSelectResult.length && userSelectResult[0]

    return user
}