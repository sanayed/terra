import type { RowDataPacket } from 'mysql2';
import db from './db/db';

type NewIssueProps = {
	issue_id: string;
	project_id: string;
	description: string;
	type: string;
	priority: string;
	reporter_id: string;
	reporter_username: string;
	assignee_username?: string | null;
};

interface IUserID extends RowDataPacket {
	id: string;
}

export const createNewIssue = async ({
	issue_id,
	project_id,
	description,
	type,
	priority,
	reporter_id,
	reporter_username,
	assignee_username
}: NewIssueProps) => {
	let assignee_id: string | undefined;
	if (typeof assignee_username != 'string') throw Error('Unknown type for assignee_id');
	else if (assignee_username == 'null') {
		assignee_id = undefined;
		assignee_username = undefined;
	} else {
		const [res] = await db.query<IUserID[]>('SELECT id FROM users WHERE username=?', [
			assignee_username
		]);
		assignee_id = res[0].id;
	}

	console.log('Assignee Details: ', assignee_id, assignee_username);

	return await db.query(
		'INSERT INTO issues (id, project_id, description, issue_type, priority, reporter_id, reporter_uname, assignee_id, assignee_uname) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
		[
			issue_id,
			project_id,
			description,
			type,
			priority,
			reporter_id,
			reporter_username,
			assignee_id,
			assignee_username
		]
	);
};

export const getIssues = async (project_id: string) => {
	return (await db.query('SELECT * FROM issues WHERE project_id = ?', [project_id]))[0];
};
