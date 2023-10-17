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

        

    } catch (e) {

        console.log(e)

        // if ( e instanceof LuciaError &&
        //     (e.message === "AUTH_INVALID_KEY_ID" ||
        //         e.message === "AUTH_INVALID_PASSWORD")
        // ) {
        //     form.errors = { password: ['Incorrect username or password'] }
        //     return fail(400, {
        //         form
        //     })
        // }
        
        // form.errors = { password: ['an unknown error occurred'] }
        // return fail(500, {
        //     form
        // })
        return json({status: 404, message: "login unsuccessful"})
    }
    
    return json({status: 200, message: "login successful"})
};