import { getAllDonors } from '$lib/server/db/donors/handler';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {

    return {
        streaming: {
            donors: getAllDonors(locals.user.userId)
        }
    };
    
}) satisfies PageServerLoad;