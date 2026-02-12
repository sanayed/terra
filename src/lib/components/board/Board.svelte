<script lang="ts">
	import type { Issue } from '$lib';
	import { getUser, openContextMenu } from '$lib/store.svelte';
	import { deleteIssue } from '$lib/utils/board';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import Item from './Item.svelte';

	let {
		title,
		issues,
		restricted = false
	}: { title: string; issues: Issue[]; restricted?: boolean } = $props();

	const isAdmin = getUser().isAdmin;
	const flipDurationMs = 300;

	function handleDndConsider(e: any) {
		issues = e.detail.items;
	}
	function handleDndFinalize(e: any) {
		issues = e.detail.items;
	}

	function openMenu(e: MouseEvent, issue: Issue) {
		const isAuthorized = issue.reporter_id == getUser().id;
		let items = [
			{
				label: 'Hello',
				action: () => {
					console.log('Hello');
				}
			},
			{
				label: 'Hai',
				action: () => {
					console.log('Hai');
				}
			}
		];

		if (isAdmin || isAuthorized) {
			items.push({
				label: 'Delete',
				action: () => {
					deleteIssue(issue.id);
				}
			});
		}
		e.preventDefault();
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
	<span class="mx-3 mt-3 text-sm text-base-content/50 select-none">{title} {restricted}</span>
	{#if !restricted}
		<ul
			class="min-h-6 space-y-2 p-3"
			use:dndzone={{
				items: issues,
				flipDurationMs,
				dropTargetStyle: { outline: '2px solid rgb(42 126 255 / 61%)', borderRadius: '0.5rem' }
			}}
			onconsider={handleDndConsider}
			onfinalize={handleDndFinalize}
		>
			{#each issues as issue (issue.id)}
				<button
					oncontextmenu={(e) => openMenu(e, issue)}
					animate:flip={{ duration: flipDurationMs }}
					class="flex w-full flex-col rounded-lg border border-base-content/20 bg-base-100 p-3 text-left"
				>
					<Item {issue} />
				</button>
			{/each}
		</ul>
	{:else}
		<ul class="mt-4 min-h-6 space-y-2">
			{#each issues as issue (issue.id)}
				<div class="flex flex-col rounded-lg border border-base-content/20 bg-base-100 p-3">
					<Item {issue} />
				</div>
			{/each}
		</ul>
	{/if}
</div>
