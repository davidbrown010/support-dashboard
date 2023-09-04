import { getAllTasks } from '$lib/server/db/tasks/handler';
// import {connect} from '$lib/server/db/sql';
import type { PageServerLoad } from './$types';

export const load = (async ({  }) => {
    
    return { 
        streaming: {
            tasks: getAllTasks() 
        }
    };

}) satisfies PageServerLoad;