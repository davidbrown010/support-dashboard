// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import("lucia").User | null;
			session: import("lucia").Session | null;
		}
	}
	interface Window {
        dataLayer:any;
    }

	/// <reference types="lucia" />
	namespace Lucia {
		interface DatabaseUserAttributes {
			username: string;
			firstName: string;
			lastName: string;
			userClass: number
		}
	}
}


export {};
