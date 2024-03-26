import { lucia, type GlobalDatabaseUserAttributes } from "lucia";
import { sveltekit } from "lucia/middleware";
import { dev } from "$app/environment";
import { planetscale } from "@lucia-auth/adapter-mysql";
import { connection } from "$lib/server/db/drizzle";

export const auth = lucia({
    adapter: planetscale(connection, {
		user: "users",
		key: "user_keys",
		session: "user_sessions"
	}),
	env: dev ? "DEV" : "PROD",
	middleware: sveltekit(),
    getUserAttributes: (userData: GlobalDatabaseUserAttributes) => {
        
        return {
            username: userData.username,
            firstName: userData.firstName,
            lastName: userData.lastName,
            userClass: userData.userClass
        }
    }
});

export type Auth = typeof auth;