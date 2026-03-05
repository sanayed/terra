import { updateIssueStatus } from '$lib/server/issue';
import { json, error } from '@sveltejs/kit';

export async function PATCH({ request, locals }) {
	const { issue_id, status, project_id } = await request.json();
	const user_id = locals?.user?.id as string;

	try {
		await updateIssueStatus(issue_id, status, user_id, project_id);
		return json({ success: true });
	} catch (e: any) {
		throw error(e.message === 'Unauthorized' ? 403 : 500, e.message);
	}
}
