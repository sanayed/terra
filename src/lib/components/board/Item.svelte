<script lang="ts">
	import type { Issue, IssuePriority, IssueType } from '$lib';
	import { user } from '$lib/store.svelte';
	import { BookOpen, BugIcon, GripVertical, SquareCheckBig } from '@lucide/svelte';
	import { dragHandle } from 'svelte-dnd-action';

	const { issue }: { issue: Issue } = $props();

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
</script>

<div class="mb-2 flex items-center justify-between">
	<div class="flex items-center gap-2">
		<IconComponent class="stroke-base-content/50" />
		<span class=" text-xs font-semibold text-base-content/50">{issue.issue_type.toUpperCase()}</span
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
