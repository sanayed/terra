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

<div class="mb-3 flex items-center justify-between">
	<div class="flex items-center gap-2">
		<IconComponent />
		<span class=" text-xs font-semibold text-neutral-500">{issue.issue_type.toUpperCase()}</span>
	</div>

	<span class={`text-xs font-semibold ${mapIssuePriorityToColor(issue.priority)}`}
		>{issue.priority.toUpperCase()}</span
	>
</div>
{issue.description}
<span>{issue.status}</span>
