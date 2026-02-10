// See https://svelte.dev/docs/kit/types#app.d.ts

import type { AccessTokenUser } from '$lib/server/auth';
import type { Project } from '$lib/server/db/models';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: AccessTokenUser | null;
			project?: Project;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
