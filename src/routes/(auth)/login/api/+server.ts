import type { RequestHandler } from './$types';
import { fail, json } from "@sveltejs/kit";
import { auth } from "$lib/server/auth/lucia";

export const POST: RequestHandler = async ({request, locals}) => {
    
    try {
        const {username, password} = await request.json()

        const key = await auth.useKey(
            "username",
            username.toLowerCase(),
            password
        );
        const session = await auth.createSession({
            userId: key.userId,
            attributes: {}
        });

        locals.auth.setSession(session);

        return json({status: 200, sessionId: session.sessionId})

    } catch (e) {

        console.log(e)

        return json({status: 404, message: "login unsuccessful"})
    }
};