import { Lucia, TimeSpan } from "lucia";
import { dev } from "$app/environment";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle"
import { db } from "../db/drizzle";
import { sessionsTable, usersTable } from "../db/users/schema";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionsTable, usersTable);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
    sessionExpiresIn: new TimeSpan(2, "w"), // 2 weeks
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username,
            firstName: attributes.firstName,
            lastName: attributes.lastName,
            userClass: attributes.userClass
		};
	}
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: Lucia.DatabaseUserAttributes;
	}
}

