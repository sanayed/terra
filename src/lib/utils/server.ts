// import { getProject } from "$lib/server/projects"

import db from '$lib/server/db/db';
import type { RowDataPacket } from 'mysql2';

interface IssueIdResp extends RowDataPacket {
	id: string;
}
interface ProjectIdResp extends RowDataPacket {
	id: string;
}

export const checkIsAdmin = async (project_id: string, user_id: string) => {
	const [rows] = await db.query<ProjectIdResp[]>(
		`SELECT  p.created_by as id FROM projects p WHERE p.id = ?`,
		[project_id]
	);
	if (rows.length > 0 && rows[0].id == user_id) {
		return true;
	}
	return false;
};

export const checkIsOwnEntity = async (issue_id: string, user_id: string) => {
	const [rows] = await db.query<IssueIdResp[]>(
		`SELECT i.reporter_id as id FROM issues i WHERE i.id = ?`,
		[issue_id]
	);

	if (rows.length > 0 && rows[0].id == user_id) {
		return true;
	}
	return false;
};
