import { getAllDonors } from '$lib/server/db/donors/handler';
import type { PageServerLoad } from './$types';

export const load = (async ({  }) => {

    return {
        streaming: {
            donors: getAllDonors()
        }
    };
    
}) satisfies PageServerLoad;