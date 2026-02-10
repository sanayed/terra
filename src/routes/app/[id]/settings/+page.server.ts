import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { deleteProject, updateProject } from '$lib/server/projects';

export const actions: Actions = {
	projectUpdate: async ({ request, params }) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const description = data.get('description') as string;

		if (name.trim() == '' && description.trim() == '') {
			return fail(500, {
				error: 'Name and description are required'
			});
		}

		try {
			await updateProject(params.id, { name, description });
		} catch (error) {
			return fail(500, {
				error: error instanceof Error ? error.message : 'Failed to update project details'
			});
		}
	},
	deleteProject: async ({ params, locals }) => {
		try {
			const project_id = params.id;
			await deleteProject(project_id, locals.user?.id as string);
			throw redirect(303, '/app');
		} catch (error) {
			if (typeof error === 'object' && error !== null && 'status' in error && 'location' in error) {
				throw error;
			}

			return fail(500, {
				error: error instanceof Error ? error.message : 'Failed to delete project'
			});
		}
	}
};
