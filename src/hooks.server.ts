import { redirect, type Handle, json, type RequestEvent, type ResolveOptions, type MaybePromise } from '@sveltejs/kit';
import { auth } from "$lib/server/auth/lucia";
import { validateApiKey } from "$lib/server/auth/api_keys";

export const handle = (async ({ event, resolve }) => {

    redirectHandler(event, resolve)
    
    if (event.url.pathname.includes("/api/")) return apiHandler(event, resolve)
    else return appHandler(event, resolve)

}) satisfies Handle;




const appHandler = async (event: RequestEvent<Partial<Record<string, string>>, string | null>, resolve: (event: RequestEvent<Partial<Record<string, string>>, string | null>, opts?: ResolveOptions | undefined) => MaybePromise<Response>) => {
    event.locals.auth = auth.handleRequest(event);
    
    const nonAuthPages = ['/login', '/register', '/resetPassword']
    
    if (nonAuthPages.indexOf(event.url.pathname) == -1) {
        let session = await event.locals.auth.validate();

	    if (!session) {

            session = await event.locals.auth.validateBearerToken();

            if (!session) {
                throw redirect(302, `/login?redirect=${encodeURI(event.url.pathname)}`);
            }
        }

        event.locals.user = {
            userId: session.user.userId,
            username: session.user.username,
            firstName: session.user.firstName,
            lastName: session.user.lastName,
            userClass: session.user.userClass
        }
    }

    const response = await resolve(event);
    
    return response;
}

const apiHandler = async (event: RequestEvent<Partial<Record<string, string>>, string | null>, resolve: (event: RequestEvent<Partial<Record<string, string>>, string | null>, opts?: ResolveOptions | undefined) => MaybePromise<Response>) => {
    const authTokenHeader = event.request.headers.get('Authorization')
    if (!authTokenHeader) return json({status: 403, message: "No authorization provided.."})

    try {
        const user = await validateApiKey(authTokenHeader)

        if (!user) return json({status: 403, message: "Invalid Authorization"})

        event.locals.user = {
            userId: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            userClass: user.class
        }
        
    } catch (e) {
        return json({status: 501, message: "Authorization unable to be processed."})
    }

    const response = await resolve(event);
    
    return response;
    

}

const redirectHandler = (event: RequestEvent<Partial<Record<string, string>>, string | null>, resolve: (event: RequestEvent<Partial<Record<string, string>>, string | null>, opts?: ResolveOptions | undefined) => MaybePromise<Response>) => {
    
    const redirects = [{
        from: '/api', to: 'https://docs.app.davidbrown.team'
    }]

    const redirectIndex = redirects.map(x=>x.from).indexOf(event.url.pathname)

    if (redirectIndex != -1)  { console.log('redirect - to: ' + redirects[redirectIndex]); throw redirect(301, redirects[redirectIndex].to) }

}
