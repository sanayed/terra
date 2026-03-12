<script lang="ts">
	import type { Issue, IssuePriority, IssueType } from '$lib';
	import { PermissionManager } from '$lib/PermissionResolver.svelte';
	import { openContextMenu, user } from '$lib/store.svelte';
	import { deleteIssue } from '$lib/utils/board';
	import { createSortable } from '@dnd-kit/svelte/sortable';
	import { BookOpen, BugIcon, SquareCheckBig } from '@lucide/svelte';

	let {
		id,
		issue,
		column,
		index
	}: {
		id: string;
		issue: Issue;
		column: string;
		index: number;
	} = $props();

	const sortable = createSortable({
		get id() {
			return id;
		},
		get index() {
			return index;
		},
		get group() {
			return column;
		},
		accept: 'item',
		type: 'item',
		feedback: 'clone',
		get data() {
			return { group: column, issue };
		}
	});

	const mapIssuePriorityToColor = (priority: IssuePriority) => {
		switch (priority) {
			case 'low':
				return 'text-green-500';
			case 'medium':
				return 'text-yellow-500';
			case 'high':
				return 'text-red-400';
			case 'critical':
				return 'text-violet-600';
		}
	};
	const mapTypeToIcons = (type: IssueType) => {
		switch (type) {
			case 'bug':
				return BugIcon;
			case 'task':
				return SquareCheckBig;
			case 'story':
				return BookOpen;
		}
	};

	const IconComponent = $derived(mapTypeToIcons(issue.issue_type));
	const isAdmin = user.isAdmin;
	function openMenu(e: MouseEvent) {
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
	{@attach sortable.attach}
	oncontextmenu={(e) => openMenu(e)}
	role="button"
	tabindex={1}
	class="my-2 flex w-full cursor-pointer flex-col rounded-lg border border-neutral-300 bg-base-200 p-3 text-left select-none"
>
	<div class="mb-2 flex items-center justify-between">
		<div class="flex items-center gap-2">
			<IconComponent class="stroke-base-content/50" />
			<span class=" text-xs font-semibold text-base-content/50"
				>{issue.issue_type.toUpperCase()}</span
			>
		</div>

		<div class="flex items-center gap-2">
			<span class={`text-xs font-semibold ${mapIssuePriorityToColor(issue.priority)}`}
				>{issue.priority.toUpperCase()}</span
			>
		</div>
	</div>
	{issue.description}
	<span class="mt-2 text-xs text-gray-500">
		Issue raised by: @{issue.reporter_uname} <br />
		{#if issue.assignee_uname != undefined}
			Assigned to: @{issue.assignee_uname}
			<br />
		{/if}
		Assigned on: {new Date(issue.created_at).toDateString()}
	</span>
</div>
