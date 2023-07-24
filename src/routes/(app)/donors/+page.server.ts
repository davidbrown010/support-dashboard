import { getAllDonors } from '$lib/server/db/donors/handler';
// import {connect} from '$lib/server/db/sql';
import type { PageServerLoad } from './$types';

export const load = (async ({  }) => {
    
    return { donors: getAllDonors() };

}) satisfies PageServerLoad;