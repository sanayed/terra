import { fail } from '@sveltejs/kit';
import type { Actions } from '../$types';
import { createNewIssue, getIssues } from '$lib/server/issue';
import { v4 } from 'uuid';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const project_id = params.id;

	try {
		const issues = await getIssues(project_id);
		return { issues };
	} catch {
		return fail(400, { message: 'Unknown error occured' });
	}
};

export const actions = {
	newIssue: async ({ request, locals, params }) => {
		const fd = await request.formData();
		const description = (fd.get('description') as string).trim();
		const type = (fd.get('type') as string).trim();
		const priority = (fd.get('priority') as string).trim();
		const assignee_username = (fd.get('assignee_username') as string).trim();

		const project_id = params.id as string;
		if (!project_id) {
			return fail(400, { message: 'Project ID not found' });
		}

		if (description == '') {
			return fail(400, { message: 'Description cannot be null' });
		}

		try {
			createNewIssue({
				issue_id: v4(),
				project_id,
				description,
				type: type,
				priority,
				reporter_id: locals.user?.id as string,
				assignee_id: assignee_username || null
			});
		} catch {
			return fail(400, { message: 'Unknown error occured' });
		}

		return { success: true };
	}
} satisfies Actions;
