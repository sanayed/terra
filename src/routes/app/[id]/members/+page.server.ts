import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getMembers } from '$lib/server/projects';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const members = await getMembers(params.id);
		return { members };
	} catch (e) {
		const message = e instanceof Error ? e.message : 'An unknown error occurred';
		return error(400, { message });
	}
};
