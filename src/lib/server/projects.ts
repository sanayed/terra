import { v4 } from 'uuid';
import db from './db/db';
import type { Member, Project } from './db/models';

export const getAllProjects = async (user_id: string) => {
	const [rows] = await db.query<Project[]>(
		`SELECT DISTINCT p.*, u.fullname AS owner_name FROM projects p JOIN users u ON u.id = p.created_by LEFT JOIN project_members pm ON pm.project_id = p.id WHERE p.created_by = ? OR pm.user_id = ? ORDER BY p.created_at DESC;`,
		[user_id, user_id]
	);
	return rows;
};

export const getProject = async (project_id: string) => {
	const [rows] = await db.query<Project[]>(`SELECT  p.* FROM projects p WHERE p.id = ?`, [
		project_id
	]);
	return rows[0];
};
export const getMembers = async (project_id: string) => {
	const [rows] = await db.query<Member[]>(
		`SELECT 
    		u.id,
    		u.fullname,
    		u.username,
    		u.email,
    		pm.role
		FROM project_members pm
		INNER JOIN users u ON pm.user_id = u.id
		WHERE pm.project_id = ? 
		ORDER BY 
		    FIELD(pm.role, 'admin', 'manager', 'member'),
		    u.fullname;`,
		[project_id]
	);
	return rows;
};

export const createProject = async (
	user_id: string,
	{ name, description }: { name: string; description: string }
) => {
	const project_id = v4();
	const conn = await db.getConnection();

	try {
		await conn.beginTransaction();

		await conn.query(
			`INSERT INTO projects (id, name, description, created_by)
       VALUES (?, ?, ?, ?)`,
			[project_id, name, description, user_id]
		);

		await conn.query(
			`INSERT INTO project_members (project_id, user_id, role)
       VALUES (?, ?, ?)`,
			[project_id, user_id, 'admin']
		);

		await conn.commit();
	} catch (err) {
		await conn.rollback();
		throw err;
	} finally {
		conn.release();
	}

	return project_id;
};

export async function deleteProject(projectId: string, userId: string) {
	// Verify the user owns the project
	const [projects] = await db.query<Project[]>(
		'SELECT * FROM projects WHERE id = ? AND created_by = ?',
		[projectId, userId]
	);

	if (projects.length === 0) {
		throw new Error('Project not found or you do not have permission');
	}

	// Delete the project (cascade will delete related records)
	return await db.query('DELETE FROM projects WHERE id = ?', [projectId]);
}
