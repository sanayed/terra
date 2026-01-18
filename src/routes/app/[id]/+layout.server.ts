import { getProject } from '$lib/server/projects';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { Project } from '$lib/server/db/models';

export const load: LayoutServerLoad = async ({ params, locals }) => {
	const project: Project = await getProject(params.id);
	if (!project) throw error(404, { message: 'Not Found' });
	const isAdmin = project.created_by == locals.user?.id;

	return { project, isAdmin };
};
