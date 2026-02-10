<script lang="ts">
	import type { Issue, IssuePriority, IssueType } from '$lib';
	import { BookOpen, BugIcon, SquareCheckBig } from '@lucide/svelte';

	const { issue }: { issue: Issue } = $props();

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

	<span class={`text-xs font-semibold ${mapIssuePriorityToColor(issue.priority)}`}
		>{issue.priority.toUpperCase()}</span
	>
</div>
{issue.description}
<span class="mt-2 text-xs text-gray-500">
	Assigned on: {new Date(issue.created_at).toDateString()}
	<br />
	{#if issue.assignee_uname != undefined}
		Assigned to: @{issue.assignee_uname}
	{/if}
</span>

<!-- <span class="opacity-50">{issue.status}</span> -->
