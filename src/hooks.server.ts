import { redirect, type Handle } from '@sveltejs/kit';
import { auth } from "$lib/server/auth/lucia";
import { param } from 'drizzle-orm';

export const handle = (async ({ event, resolve }) => {

    event.locals.auth = auth.handleRequest(event);
    
    const nonAuthPages = ['/login', '/register', '/resetPassword', '/login/api']
    
    if (nonAuthPages.indexOf(event.url.pathname) == -1) {
        const session = await event.locals.auth.validate();

	    if (!session) {
            //checks for API usage
            const authorizationHeader = event.request.headers.get("Authorization");
            const session = await event.locals.auth.validateBearerToken();

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