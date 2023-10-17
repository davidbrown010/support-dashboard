import { redirect, type Handle, json } from '@sveltejs/kit';
import { auth } from "$lib/server/auth/lucia";

export const handle = (async ({ event, resolve }) => {

    event.locals.auth = auth.handleRequest(event);
    
    const nonAuthPages = ['/login', '/register', '/resetPassword', '/login/api', '/logout/api']
    
    if (nonAuthPages.indexOf(event.url.pathname) == -1) {
        const session = await event.locals.auth.validate();

	    if (!session) {
            //checks for API usage
            const authorizationHeader = event.request.headers.get("Authorization");
            const session = await event.locals.auth.validateBearerToken();

            if (event.url.pathname.includes("api")) return json({status: 403, message: "Unauthorized."})
            throw redirect(302, `/login?redirect=${encodeURI(event.url.pathname)}`);
        }

        event.locals.user = {
            userId: session.user.userId,
            username: session.user.username,
            firstName: session.user.firstName,
            lastName: session.user.lastName,
        }
    }

    const response = await resolve(event);
    
    return response;

}) satisfies Handle;