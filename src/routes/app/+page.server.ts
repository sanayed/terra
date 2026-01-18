import { createProject, getAllProjects } from '$lib/server/projects';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../auth/$types';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const projects = await getAllProjects(locals.user?.id as string);

	return {
		projects
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();

		const name = (data.get('name') as string).trim();
		const description = (data.get('description') as string).trim();

		let project_id;

		if (!locals.user) throw redirect(303, '/login');
		if (name == '' || description == '') return fail(400, { error: 'Fields cannot be empty' });
		try {
			project_id = await createProject(locals.user?.id as string, { name, description });
		} catch (error) {
			const message = error instanceof Error ? error.message : 'An unknown error occurred';
			return fail(400, { error: message });
		}

		throw redirect(303, `/app/${project_id}/`);
	}
};
