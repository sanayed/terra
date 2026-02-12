import { fail } from '@sveltejs/kit';
import type { Actions } from '../$types';
import { createNewIssue, deleteIssue, getIssues } from '$lib/server/issue';
import { v4 } from 'uuid';
import type { PageServerLoad } from './$types';
import { getMembersUsername } from '$lib/server/projects';

export const load: PageServerLoad = async ({ params }) => {
	const project_id = params.id;

	try {
		const issues = await getIssues(project_id);
		const membersUsername = await getMembersUsername(project_id);
		return { issues, membersUsername };
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
		const assignee_username = String(fd.get('assignee_username'));

		const project_id = params.id as string;
		if (!project_id) {
			return fail(400, { message: 'Project ID not found' });
		}

		if (description == '') {
			return fail(400, { message: 'Description cannot be null' });
		}

		try {
			await createNewIssue({
				issue_id: v4(),
				project_id,
				description,
				type,
				priority,
				reporter_id: locals.user?.id as string,
				reporter_username: locals.user?.username as string,
				assignee_username
			});
		} catch (error) {
			if (error instanceof Error) {
				return fail(400, { message: error.message });
			}
			return fail(400, { message: 'Unknown error occured' });
		}

		return { success: true };
	},
	deleteIssue: async ({ request, params, locals }) => {
		const fd = await request.formData();
		const issue_id = String(fd.get('issue_id'));

		try {
			await deleteIssue(params?.id as string, issue_id, locals.user?.id as string);
			return { success: true };
		} catch (error) {
			console.log(error);
			
			if (error instanceof Error) {
				return fail(400, { message: error.message });
			}
			return fail(400, { message: 'Unknown error occured' });
		}
	}
} satisfies Actions;
