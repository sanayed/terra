<script lang="ts">
	import { dndzone } from 'svelte-dnd-action';
	import Item from './Item.svelte';
	import type { Issue } from '$lib';
	import { flip } from 'svelte/animate';

	let { title, issues }: { title: string; issues: Issue[] } = $props();
	const flipDurationMs = 300;

	function handleDndConsider(e: any) {
		issues = e.detail.items;
	}
	function handleDndFinalize(e: any) {
		issues = e.detail.items;
	}
</script>

<div
	class="flex h-full w-full min-w-60 flex-col rounded-[14px] border border-neutral-300 bg-base-200 p-3"
>
	<span class="text-sm text-neutral-600 select-none">{title}</span>
	<ul
		class="mt-4 min-h-6 space-y-2"
		use:dndzone={{
			items: issues,
			flipDurationMs,
			dropTargetStyle: { outline: '2px solid rgb(42 126 255 / 61%)' }
		}}
		onconsider={handleDndConsider}
		onfinalize={handleDndFinalize}
	>
		{#each issues as issue (issue.id)}
			<div
				animate:flip={{ duration: flipDurationMs }}
				class="flex flex-col rounded-field border border-neutral-200 bg-base-100 p-3"
			>
				<Item {issue} />
			</div>
		{/each}
	</ul>
</div>
