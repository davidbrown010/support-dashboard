import { fail, redirect } from "@sveltejs/kit";
import { auth } from "$lib/server/auth/lucia";
import type { PageServerLoad, Actions } from "./$types";
import { DatabaseError } from "@planetscale/database";
import { z } from "zod"
import { superValidate } from 'sveltekit-superforms/server'

const newUserSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    username: z.string().min(4),
    password: z.string().min(8),
})

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.auth.validate()
    if (session) throw redirect(302, "/")

    const form = await superValidate(event, newUserSchema)
    return { form }
}

export const actions: Actions = {
	default: async (event) => {

        const form = await superValidate(event, newUserSchema)

        if (!form.valid) {
            return fail(400, {
                form
            })
        }

        try {
            const user = await auth.createUser({
                key: {
                    providerId: "username",
                    providerUserId: form.data.username.toLowerCase(),
                    password: form.data.password
                },
                attributes: {
                    username: form.data.username,
                    firstName: form.data.firstName,
                    lastName: form.data.lastName
                }
            });

            try {
                const session = await auth.createSession({
                    userId: user.userId,
                    attributes: {}
                });

                event.locals.auth.setSession(session);

            }
            catch (e) {
                throw new Error("redirect:/")
            }
        }
        catch (e) {

            console.log(e)

            if (e instanceof DatabaseError &&
                e.message.includes("Duplicate entry") &&
                e.message.includes("username_unique")
            ) {
                form.errors = { username: ['username already taken'] }
                return fail(400, {
                    form
                })
            }

            if (e instanceof Error &&
                e.message == "redirect:/") {
                throw redirect(302, encodeURI(`/login?message=there was a problem logging you in, please try again`));
            }

            form.errors = { password: ['an unknown error occurred'] }
            return fail(500, {
                form
            })
        }

        throw redirect(302, "/welcome");
	}
};