import { getLookerReports } from "$lib/server/db/icalEvents/handler";
import type { PageServerLoad } from "../../../$types";

export const load: PageServerLoad = async ({locals}) => {

    return {
        streaming: {
            reports: getLookerReports(locals.user.userId)
        }
    }
    
}