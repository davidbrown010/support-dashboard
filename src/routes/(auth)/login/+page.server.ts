import { fail, redirect } from "@sveltejs/kit";
import { lucia } from "$lib/server/auth/lucia";
import type { PageServerLoad, Actions } from "./$types";
import { z } from "zod"
import { superValidate } from 'sveltekit-superforms/server'
import { findValidUser } from "$lib/server/db/users/handler";


const loginSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
})

export const load: PageServerLoad = async (event) => {
    const form = await superValidate(event, loginSchema)
    return { form }
}

export const actions: Actions = {
	default: async (event) => {

        const form = await superValidate(event, loginSchema)

        if (!form.valid) {
            return fail(400, {
                form
            })
        }

        try {
            const existingUser = await findValidUser(form.data.username, form.data.password)
            
            if (existingUser == false) {
                form.errors = { password: ['Incorrect username or password'] }
                return fail(400, {
                    form
                })
            }

            const session = await lucia.createSession(existingUser.id, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            event.cookies.set(sessionCookie.name, sessionCookie.value, {
                path: ".",
                ...sessionCookie.attributes
            });

		} catch (e) {

            console.log(e)

			// if ( e instanceof LuciaError &&
			// 	(e.message === "AUTH_INVALID_KEY_ID" ||
			// 		e.message === "AUTH_INVALID_PASSWORD")
			// ) {
            //     form.errors = { password: ['Incorrect username or password'] }
            //     return fail(400, {
            //         form
            //     })
			// }
			
            form.errors = { password: ['an unknown error occurred'] }
            return fail(500, {
                form
            })
		}

        const paramRedirect = event.url.searchParams.get("redirect")
        if (paramRedirect) throw redirect(302, decodeURI(paramRedirect))
        
        else throw redirect(302, "/");
	}
};