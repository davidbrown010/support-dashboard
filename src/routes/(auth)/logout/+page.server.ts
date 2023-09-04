import { auth } from "$lib/server/auth/lucia";
import { redirect, type Actions, fail } from "@sveltejs/kit";

export const actions: Actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId);
		locals.auth.setSession(null);
		throw redirect(302, "/login");
	}
};