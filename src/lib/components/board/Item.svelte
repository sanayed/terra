<script lang="ts">
	import type { Issue, IssuePriority, IssueType } from '$lib';
	import { openContextMenu, user } from '$lib/store.svelte';
	import { deleteIssue } from '$lib/utils/board';
	import { useSortable, type UseSortableInput } from '@dnd-kit-svelte/svelte/sortable';
	import { BookOpen, BugIcon, GripVertical, SquareCheckBig } from '@lucide/svelte';
	import { dragHandle } from 'svelte-dnd-action';

	interface Props extends UseSortableInput {
		issue: Issue;
		isOverlay?: boolean;
	}
	let { issue, isOverlay = false, ...rest }: Props = $props();

	const { ref, isDragging } = useSortable({ ...rest, feedback: 'move' });

	const isAuthorized = () => {
		if (user.isAdmin) {
			return true;
		}
		if (issue.assignee_id == user.id) {
			return true;
		}
		if (issue.reporter_id == user.id) {
			return true;
		}

		return false;
	};

	const isDraggable = isAuthorized();

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
	{@attach ref}
	role="button"
	tabindex="-1"
	oncontextmenu={(e) => openMenu(e, issue)}
	class="relative flex w-full flex-col rounded-lg border border-base-content/20 bg-base-100 p-3 text-left select-none"
>
	<!-- Original element - becomes invisible during drag but maintains dimensions -->
	<div class={['flex flex-col', { invisible: isDragging.current && !isOverlay }]}>
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
				{#if isDraggable}
					<div
						use:dragHandle
						aria-label="drag-handle for {issue.description}"
						class="rounded p-1 hover:bg-base-content/10"
					>
						<GripVertical class="stroke-base-content/50" size={8} />
					</div>
				{/if}
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

	<!-- Drag placeholder - set to match original dimensions -->
	{#if !isOverlay && isDragging.current}
		<div class="absolute inset-0 flex items-center justify-center">
			<div
				class="flex h-full w-full items-center justify-center rounded-md border-2 border-dashed border-blue-500"
			>
				<span class="text-blue-500">Moving: {issue.description}</span>
			</div>
		</div>
	{/if}
</div>
