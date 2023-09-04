// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			auth: import("lucia").AuthRequest;
			user: Lucia.DatabaseUserAttributes & { userId: string }
		}
	}
	interface Window {
        dataLayer:any;
    }

	/// <reference types="lucia" />
	namespace Lucia {
		type Auth = import("$lib/server/auth/lucia").Auth;
		type DatabaseUserAttributes = {
            username: string,
            firstName: string,
            lastName: string
		};
		type DatabaseSessionAttributes = {};
	}
}

export {};
