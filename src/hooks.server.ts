import { redirect, type Handle } from '@sveltejs/kit';
import { auth } from "$lib/server/auth/lucia";

export const handle = (async ({ event, resolve }) => {

    event.locals.auth = auth.handleRequest(event);
    
    const nonAuthPages = ['/login', '/register', '/resetPassword']
    
    if (nonAuthPages.indexOf(event.url.pathname) == -1) {
        const session = await event.locals.auth.validate();
	    if (!session) throw redirect(302, "/login");

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