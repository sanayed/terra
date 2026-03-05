import type { Issue, IssueStatus } from './server/db/models';

export type ProjectMemberRole = 'admin' | 'manager' | 'member';

export interface PermissionContext {
	userId: string;
	userRole: ProjectMemberRole;
	projectId: string;
	isProjectOwner: boolean;
}

export class PermissionManager {
	private context: PermissionContext;

	constructor(context: PermissionContext) {
		this.context = context;
	}

	/** Check if user can create an issue */
	canCreateIssue(): boolean {
		return true; // Everyone can create issues
	}

	/** Check if user can assign/reassign an issue */
	canAssignIssue(): boolean {
		return this.context.userRole === 'manager' || this.context.userRole === 'admin';
	}

	/** Check if user can move issue to a specific status */
	canTransitionIssue(
		issue: Pick<Issue, 'status' | 'assignee_id' | 'reporter_id'>,
		targetStatus: IssueStatus
	): boolean {
		const isAssigned = issue.assignee_id === this.context.userId;
		const isReporter = issue.reporter_id === this.context.userId;
		const isManager = this.context.userRole === 'manager' || this.context.userRole === 'admin';

		switch (issue.status) {
			case 'todo':
				// TO DO → IN PROGRESS: assigned user or manager
				if (targetStatus === 'in_progress') {
					return (isAssigned || isReporter) && issue.assignee_id !== null;
				}
				break;

			case 'in_progress':
				// IN PROGRESS → IN REVIEW: assigned user only
				if (targetStatus === 'in_review') {
					return isAssigned;
				}
				// IN PROGRESS → TO DO: manager only (future feature)
				if (targetStatus === 'todo') {
					return isManager;
				}
				break;

			case 'in_review':
				// IN REVIEW → DONE: manager only
				if (targetStatus === 'done') {
					return isManager;
				}
				// IN REVIEW → IN PROGRESS: future feature (rejection)
				if (targetStatus === 'in_progress') {
					return isManager;
				}
				break;

			case 'done':
				// DONE state: manager only for any changes
				return isManager;
		}

		return false;
	}

	/** Check if user can delete an issue */
	canDeleteIssue(issue: Pick<Issue, 'reporter_id'>): boolean {
		const isReporter = issue.reporter_id === this.context.userId;
		const isManager = this.context.userRole === 'manager' || this.context.userRole === 'admin';

		return isReporter || isManager;
	}

	/** Check if user can edit issue details (description, priority, type) */
	canEditIssue(issue: Pick<Issue, 'reporter_id' | 'assignee_id'>): boolean {
		const isReporter = issue.reporter_id === this.context.userId;
		const isAssigned = issue.assignee_id === this.context.userId;
		const isManager = this.context.userRole === 'manager' || this.context.userRole === 'admin';

		return isReporter || isAssigned || isManager;
	}

	/** Check if user can manage project settings */
	canManageProject(): boolean {
		return this.context.isProjectOwner;
	}

	/** Check if user can invite/kick members */
	canManageMembers(): boolean {
		return this.context.isProjectOwner;
	}

	/** Get user's role */
	getRole(): ProjectMemberRole {
		return this.context.userRole;
	}

	/** Check if user is admin */
	isAdmin(): boolean {
		return this.context.userRole === 'admin' || this.context.isProjectOwner;
	}
}
