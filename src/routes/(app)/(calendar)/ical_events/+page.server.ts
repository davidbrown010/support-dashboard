import type { PageServerLoad, Actions } from './$types';
import {getAllICalEvents, getAllCategories, modifyEnhancedEvent} from '$lib/server/db/icalEvents/handler'
import { fail, redirect } from "@sveltejs/kit";

export const load = (async (event) => {

    return {
        streaming: {
            events: getAllICalEvents(),
            categories: getAllCategories()
        }
    }

}) satisfies PageServerLoad;



export const actions = {
	default: async (event) => {
        
	},
} satisfies Actions;