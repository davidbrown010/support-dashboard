import type { LayoutServerLoad } from "./$types"
import { getDonor, getDonorNotes } from "$lib/server/db/donors/handler"
import { error } from "@sveltejs/kit"

export const load: LayoutServerLoad = async ({params, locals}) => {

    const donor = await getDonor(parseInt(params.id), locals.user.userId)
    const donorNotes = await getDonorNotes(parseInt(params.id))

    if (!donor) throw error(404, "No donor found")

    return {
        streaming: {
            donor,
            donorNotes
        }
    }

    
}