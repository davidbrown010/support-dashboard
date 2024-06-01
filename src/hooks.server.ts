import { redirect, type Handle, json, type RequestEvent, type ResolveOptions, type MaybePromise } from '@sveltejs/kit';
import { lucia } from "$lib/server/auth/lucia";
import { validateApiKey } from "$lib/server/auth/api_keys";

export const handle = (async ({ event, resolve }) => {

    redirectHandler(event, resolve)
    
    // if (event.url.pathname.includes("/api/")) return apiHandler(event, resolve)
     return appHandler(event, resolve)

}) satisfies Handle;




const appHandler = async (event: RequestEvent<Partial<Record<string, string>>, string | null>, resolve: (event: RequestEvent<Partial<Record<string, string>>, string | null>, opts?: ResolveOptions | undefined) => MaybePromise<Response>) => {
    
    const nonAuthPages = ['/login', '/register', '/resetPassword']
    
    //If the page requires authentication.
    if (nonAuthPages.indexOf(event.url.pathname) == -1) {

        //get the sessionId from cookies
        const sessionId = event.cookies.get(lucia.sessionCookieName);
        if (!sessionId) {
            event.locals.user = null;
            event.locals.session = null;
            return resolve(event);
        }

        const { session, user } = await lucia.validateSession(sessionId);
        if (session && session.fresh) {
            const sessionCookie = lucia.createSessionCookie(session.id);
            event.cookies.set(sessionCookie.name, sessionCookie.value, {
                path: ".",
                ...sessionCookie.attributes
            });
        }
        if (!session) {
            const sessionCookie = lucia.createBlankSessionCookie();
            event.cookies.set(sessionCookie.name, sessionCookie.value, {
                path: ".",
                ...sessionCookie.attributes
            });
            // throw redirect(302, `/login?redirect=${encodeURI(event.url.pathname)}`);
        }
        event.locals.user = user;
        event.locals.session = session;
        return resolve(event);

    }

    const response = await resolve(event);
    
    return response;
    
    
    
}

// const apiHandler = async (event: RequestEvent<Partial<Record<string, string>>, string | null>, resolve: (event: RequestEvent<Partial<Record<string, string>>, string | null>, opts?: ResolveOptions | undefined) => MaybePromise<Response>) => {
//     const authTokenHeader = event.request.headers.get('Authorization')
//     if (!authTokenHeader) return json({status: 403, message: "No authorization provided.."})

//     try {
//         const user = await validateApiKey(authTokenHeader)

//         if (!user) return json({status: 403, message: "Invalid Authorization"})

//         event.locals.user = {
//             userId: user.id,
//             username: user.username,
//             firstName: user.firstName,
//             lastName: user.lastName,
//             userClass: user.class
//         }
        
//     } catch (e) {
//         return json({status: 501, message: "Authorization unable to be processed."})
//     }

//     const response = await resolve(event);
    
//     return response;
    

// }

const redirectHandler = (event: RequestEvent<Partial<Record<string, string>>, string | null>, resolve: (event: RequestEvent<Partial<Record<string, string>>, string | null>, opts?: ResolveOptions | undefined) => MaybePromise<Response>) => {
    
    const redirects = [{
        from: '/api', to: 'https://docs.app.davidbrown.team'
    }]

    const redirectIndex = redirects.map(x=>x.from).indexOf(event.url.pathname)

    if (redirectIndex != -1)  { console.log('redirect - to: ' + redirects[redirectIndex]); throw redirect(301, redirects[redirectIndex].to) }

}
