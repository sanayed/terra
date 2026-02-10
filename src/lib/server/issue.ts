import db from './db/db';

type NewIssueProps = {
	issue_id: string;
	project_id: string;
	description: string;
	type: string;
	priority: string;
	reporter_id: string;
	assignee_id?: string | null;
};

export const createNewIssue = async ({
	issue_id,
	project_id,
	description,
	type,
	priority,
	reporter_id,
	assignee_id
}: NewIssueProps) => {
	return await db.query(
		'INSERT INTO issues (id, project_id, description, issue_type, priority, reporter_id, assignee_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
		[issue_id, project_id, description, type, priority, reporter_id, assignee_id]
	);
};

export const getIssues = async (project_id: string) => {
	return (await db.query('SELECT * FROM issues WHERE project_id = ?', [project_id]))[0];
};
