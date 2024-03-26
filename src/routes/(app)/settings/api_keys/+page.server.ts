import type { PageServerLoad, Actions } from "./$types";

import { getApiKeys, createApiKey, removeApiKey } from "$lib/server/db/api_keys/handler";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
    const userApiKeys = await getApiKeys(event.locals.user.userId)

    return {
        streaming: {
            apiKeys: userApiKeys
        }
    }
}

export const actions: Actions = {
	requestApiKey: async (event) => {
        try {
            const newApiKey = await createApiKey(event.locals.user.userId)
            return newApiKey
        } catch (e) {
            redirect(301, '/settings/api_keys?message="Api Key Request Failed"') 
        }
    },
    removeApiKey: async (event) => {
        try {
            const formData = await event.request.formData()
            const apiKeyIdString = formData.get('apiKeyId') as string
            if (!apiKeyIdString) throw new Error('no api key provided')
            await removeApiKey(event.locals.user.userId, apiKeyIdString)
        }
        catch (e) {
            
        }
    }
};