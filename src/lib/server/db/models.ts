import type { RowDataPacket } from 'mysql2';

// --- User ---
export interface User extends RowDataPacket {
	id: string; // CHAR(36)
	email: string;
	username: string;
	fullname: string;
	password_hash: string;
	created_at: Date;
}

// --- Project ---
export type ProjectStatus = 'active' | 'rejected' | 'postponed';

export interface Project extends RowDataPacket {
	id: string; // CHAR(36)
	name: string;
	description: string;
	status: ProjectStatus;
	created_by: string; // FK to User.id
	created_at: Date;
}

// --- Project Members ---
export type ProjectMemberRole = 'member' | 'manager' | 'admin';

export interface ProjectMember extends RowDataPacket {
	id: number; // AUTO_INCREMENT
	project_id: string; // FK to Project.id
	user_id: string; // FK to User.id
	role: ProjectMemberRole;
}

// --- Issues ---
export type IssueType = 'task' | 'bug' | 'story';
export type IssueStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';

export interface Issue extends RowDataPacket {
	id: string; // CHAR(36)
	project_id: string; // FK to Project.id
	description: string;
	issue_type: IssueType;
	status: IssueStatus;
	priority: IssuePriority;
	reporter_id: string; // FK to User.id
	assignee_id?: string | null; // nullable
	created_at: Date;
	updated_at: Date;
}

// --- Refresh Tokens ---
export interface RefreshToken extends RowDataPacket {
	id: number; // AUTO_INCREMENT
	user_id: string; // FK to User.id
	token: string;
	user_agent?: string | null;
	created_at: Date;
	expires_at: Date;
}

export interface Member
	extends RowDataPacket, Pick<User, 'fullname' | 'email' | 'username' | 'id'> {
	role: 'member' | 'manager' | 'admin';
}
