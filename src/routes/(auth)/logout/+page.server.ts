import { lucia } from "$lib/server/auth/lucia";
import { redirect, type Actions, fail } from "@sveltejs/kit";

export const actions: Actions = {
	logout: async ({ locals, cookies }) => {

		if (!locals.session) {
			return fail(401);
		}
		await lucia.invalidateSession(locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
		redirect(302, "/login");
	}
};