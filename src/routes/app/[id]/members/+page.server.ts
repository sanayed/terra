import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getMembers, getProject, inviteUser, kickUser } from '$lib/server/projects';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const members = await getMembers(params.id);
		return { members };
	} catch (e) {
		const message = e instanceof Error ? e.message : 'An unknown error occurred';
		return error(400, { message });
	}
};

export const actions = {
	invite: async ({ request, locals, params }) => {
		const fd = await request.formData();
		let username = fd.get('username');

		if (!username || typeof username !== 'string') {
			return fail(400, { message: 'Username is required' });
		}

		username = username.trim();
		if (username.charAt(0) == '@') {
			username = username.slice(1);
		}

		const projectId = params.id;
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const project = await getProject(projectId);

		if (!project) {
			return fail(404, { message: 'Project not found' });
		}

		if (project.created_by !== locals.user.id) {
			return fail(403, { message: 'Unauthorized' });
		}

		try {
			await inviteUser(username, project.id);
		} catch (error) {
			if (error?.code == 'ER_DUP_ENTRY') {
				console.log(error.message);
				return fail(400, { message: 'User already exist in project' });
			}
			if (error instanceof Error) {
				return fail(400, { message: error.message });
			}
			return fail(500, { message: 'Unexpected error' });
		}
	},
	kick: async ({ request, locals, params }) => {
		const fd = await request.formData();
		let userid = fd.get('userid');

		if (!userid || typeof userid !== 'string') {
			return fail(400, { message: 'userid is required' });
		}

		userid = userid.trim();

		const projectId = params.id;
		if (!locals.user) {
			return fail(401, { message: 'Unauthorized' });
		}

		const project = await getProject(projectId);

		if (!project) {
			return fail(404, { message: 'Project not found' });
		}

		if (project.created_by !== locals.user.id) {
			return fail(403, { message: 'Unauthorized' });
		}

		try {
			await kickUser(userid, project.id);
		} catch (error) {
			if (error instanceof Error) {
				return fail(400, { message: error.message });
			}
			return fail(500, { message: 'Unexpected error' });
		}
	}
};
