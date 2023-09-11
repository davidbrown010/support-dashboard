import { fail, redirect } from "@sveltejs/kit";
import { auth } from "$lib/server/auth/lucia";
import { LuciaError } from "lucia"
import type { PageServerLoad, Actions } from "./$types";
import { DatabaseError } from "@planetscale/database";
import { z } from "zod"
import { superValidate } from 'sveltekit-superforms/server'

const loginSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
})

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.auth.validate()
    if (session) throw redirect(302, "/")

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

			const key = await auth.useKey(
				"username",
				form.data.username.toLowerCase(),
				form.data.password
			);
			const session = await auth.createSession({
				userId: key.userId,
				attributes: {}
			});
			event.locals.auth.setSession(session);
            

		} catch (e) {

            console.log(e)

			if ( e instanceof LuciaError &&
				(e.message === "AUTH_INVALID_KEY_ID" ||
					e.message === "AUTH_INVALID_PASSWORD")
			) {
                form.errors = { password: ['Incorrect username or password'] }
                return fail(400, {
                    form
                })
			}
			
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