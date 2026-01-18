import type { Actions } from '../$types';

export const actions = {
	newIssue: async ({ request }) => {
		const fd = await request.formData();
		const description = fd.get('description');
		const type = fd.get('type');
		const priority = fd.get('priority');
		const assignee_username = fd.get('assignee_username');

		console.log(description, type, priority, assignee_username);
	}
} satisfies Actions;
