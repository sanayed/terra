import { getUserData } from '$lib/server/user';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllProjects } from '$lib/server/projects';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/auth');

	const user = await getUserData(locals.user?.id);
	const projects = await getAllProjects(locals.user?.id);
	return {
		user,
		projects
	};
};
