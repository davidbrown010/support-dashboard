import { fail, redirect} from "@sveltejs/kit";
import { lucia } from "$lib/server/auth/lucia";
import type { PageServerLoad, Actions } from "./$types";
import { z } from "zod"
import { superValidate } from 'sveltekit-superforms/server'
import { createNewUser } from "$lib/server/db/users/handler";


const newUserSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    username: z.string().min(4),
    password: z.string().min(8),
})

export const load: PageServerLoad = async (event) => {
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
            const newUser = await createNewUser(form.data.username, form.data.firstName.toLowerCase(), form.data.lastName.toLowerCase(), form.data.password)

            const session = await lucia.createSession(newUser.userId, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            event.cookies.set(sessionCookie.name, sessionCookie.value, {
                path: ".",
                ...sessionCookie.attributes
            });

        }
        catch (e) {

            console.log(e)

            // if (e instanceof DatabaseError &&
            //     e.message.includes("Duplicate entry") &&
            //     e.message.includes("username_unique")
            // ) {
            //     form.errors = { username: ['username already taken'] }
            //     return fail(400, {
            //         form
            //     })
            // }

            // if (e instanceof Error &&
            //     e.message == "redirect:/") {
            //     throw redirect(302, encodeURI(`/login?message=there was a problem logging you in, please try again`));
            // }

            if (e instanceof Error &&
                e.message == "username taken") {
                form.errors = { username: ['username is already taken'] }
            }
            else {
                form.errors = { password: ['an unknown error occurred'] }
            }
            
            return fail(500, {
                form
            })
        }

        throw redirect(302, "/welcome");
	}
};