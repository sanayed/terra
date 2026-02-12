<script lang="ts">
	import type { Issue } from '$lib';
	import { openContextMenu, user } from '$lib/store.svelte';
	import { deleteIssue, updateIssueStatus } from '$lib/utils/board';
	import {
		dragHandleZone,
		SHADOW_ITEM_MARKER_PROPERTY_NAME,
		type DndEvent
	} from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import Item from './Item.svelte';

	let {
		title,
		issues,
		restricted = false
	}: { title: string; issues: Issue[]; restricted?: boolean } = $props();

	const isAdmin = user.isAdmin;
	const flipDurationMs = 300;

	let previousIssues: Issue[] = $state([]);
	let isUpdating = $state(false);
	let error = $state<string | null>(null);

	function handleDndConsider({ detail }: CustomEvent<DndEvent<Issue>>) {
		issues = detail.items;
	}

	async function handleDndFinalize({ detail }: CustomEvent<DndEvent<Issue>>) {
		const movedIssue = detail.items.filter((v) => v.id == detail.info.id)[0];
		if (!movedIssue) return;

		const fromStatus = getStatusFromIssue(movedIssue); // Current status before move
		const toStatus = getStatusFromTitle(title); // Where it was dropped

		console.log(`Moved issue ${movedIssue.id}:`, {
			title: movedIssue.description,
			from: fromStatus,
			to: toStatus
		});

		issues = detail.items;

		if (fromStatus === toStatus) {
			// Only reordered within same column
			previousIssues = detail.items;
			return;
		}

		// Issue moved to a different column
		const canTransition = validateTransition(movedIssue, toStatus);

		if (!canTransition.allowed) {
			error = canTransition.reason || 'Cannot move this issue';
			issues = previousIssues;
			setTimeout(() => (error = null), 3000);
			return;
		}

		// Call backend
		isUpdating = true;
		try {
			const newStatus = getStatusFromTitle(title);
			await updateIssueStatus(movedIssue.id, newStatus);
			previousIssues = detail.items;
			issues = detail.items;
		} catch (err) {
			error = 'Failed to update status';
			issues = previousIssues;
			setTimeout(() => (error = null), 3000);
		} finally {
			isUpdating = false;
		}
	}

	function validateTransition(
		issue: Issue,
		toStatus: string
	): { allowed: boolean; reason?: string } {
		const isAssignee = issue.assignee_id === user.id;
		const isManager = user.isAdmin as boolean;

		// Transition rules based on chatgpt.md workflow
		const rules: Record<string, Record<string, (issue: Issue) => boolean>> = {
			todo: {
				in_progress: () => isAssignee || isManager
			},
			in_progress: {
				todo: () => isManager, // Manager only backward
				in_review: () => isAssignee && !!issue.commit_url // Needs commit URL
			},
			in_review: {
				done: () => isManager // Manager only
			}
		};

		const currentStatus = getStatusFromIssue(issue);
		const transition = rules[currentStatus]?.[toStatus];

		if (!transition) {
			return { allowed: false, reason: 'Invalid transition' };
		}

		if (!transition(issue)) {
			if (toStatus === 'in_review' && !issue.commit_url) {
				return { allowed: false, reason: 'Commit URL required' };
			}
			if (toStatus === 'todo' || toStatus === 'done') {
				return { allowed: false, reason: 'Only managers can do this' };
			}
			return { allowed: false, reason: 'Not assigned to you' };
		}

		return { allowed: true };
	}

	function findChangedIssues(oldIssues: Issue[], newIssues: Issue[]): Issue[] {
		// Find items that are new to this column (moved in from another column)
		// by checking if their index changed significantly or they're completely new
		const oldIds = new Set(oldIssues.map((i) => i.id));
		const newIds = new Set(newIssues.map((i) => i.id));

		// Items that exist in newIssues but not in oldIssues = moved to this column
		return newIssues.filter((newIssue) => !oldIds.has(newIssue.id));
	}

	function getStatusFromTitle(boardTitle: string): string {
		const statusMap: Record<string, string> = {
			'TO DO': 'todo',
			'IN PROGRESS': 'in_progress',
			'IN REVIEW': 'in_review',
			DONE: 'done'
		};
		return statusMap[boardTitle] || boardTitle.toLowerCase().replace(/\s+/g, '_');
	}

	function getStatusFromIssue(issue: Issue): string {
		console.log(issue);

		return issue.status;
	}

	function openMenu(e: MouseEvent, issue: Issue) {
		e.preventDefault();
		const isAuthorized = issue.reporter_id == user.id;
		let items = [];

		if (isAdmin || isAuthorized) {
			items.push({
				label: 'Delete',
				action: () => {
					deleteIssue(issue.id);
				}
			});
		}

		if (items.length == 0) {
			return;
		}
		openContextMenu({
			x: e.clientX,
			y: e.clientY,
			items
		});
	}
</script>

<div
	class="flex h-full w-full min-w-60 flex-col rounded-lg border border-base-content/20 bg-base-300 transition-all"
>
	<span class="mx-3 mt-3 text-sm text-base-content/50 select-none">{title}</span>

	{#if error}
		<div class="mx-3 rounded bg-error/20 px-3 py-2 text-xs text-error">
			{error}
		</div>
	{/if}

	{#if isUpdating}
		<div class="mx-3 rounded bg-info/20 px-3 py-2 text-xs text-info">Updating...</div>
	{/if}

	<ul
		class="h-full min-h-6 space-y-2 p-3"
		use:dragHandleZone={{
			items: issues,
			flipDurationMs,
			dropTargetStyle: { outline: '2px solid rgb(42 126 255 / 61%)', borderRadius: '0.5rem' },

			dropFromOthersDisabled: restricted
		}}
		onconsider={handleDndConsider}
		onfinalize={handleDndFinalize}
	>
		{#each issues as issue (issue.id)}
			<button
				data-is-dnd-shadow-item-hint={(issue as any)[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
				oncontextmenu={(e) => openMenu(e, issue)}
				animate:flip={{ duration: flipDurationMs }}
				class="relative flex w-full flex-col rounded-lg border border-base-content/20 bg-base-100 p-3 text-left"
			>
				{#if (issue as any)[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
					<div class="custom-shadow-item p-3">
						<!-- <Item {issue} /> -->
					</div>
				{/if}
				<Item {issue} />
			</button>
		{/each}
	</ul>
</div>

<style>
	.custom-shadow-item {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		visibility: visible;
		border: 1px dashed grey;
		border-radius: var(--radius-lg);
		background: rgb(199, 199, 199);
		opacity: 0.5;
		margin: 0;
		padding: 12px;
	}
</style>
