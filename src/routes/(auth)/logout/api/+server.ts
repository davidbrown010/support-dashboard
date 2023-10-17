import { auth } from "$lib/server/auth/lucia";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({request, locals}) => {
    
    try {
        const session = await locals.auth.validate();
		if (!session) {
            const {sessionId} = await request.json()
            if (!sessionId) return json({status: 404, message: "logout unsuccessful"})
            await auth.invalidateSession(sessionId);
		    locals.auth.setSession(null);
        }
        else {
            await auth.invalidateSession(session.sessionId);
		    locals.auth.setSession(null);
        }
		
        return json({status: 200, message: "Log out successful"})

    } catch (e) {

        console.log(e)

        return json({status: 404, message: "logout unsuccessful"})
    }
};