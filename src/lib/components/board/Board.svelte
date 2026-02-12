<script lang="ts">
	import type { Issue } from '$lib';
	import { getUser, openContextMenu } from '$lib/store.svelte';
	import { deleteIssue } from '$lib/utils/board';
	import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import Item from './Item.svelte';
	import { fade } from 'svelte/transition';
	import { cubicIn } from 'svelte/easing';

	let {
		title,
		issues,
		restricted = false
	}: { title: string; issues: Issue[]; restricted?: boolean } = $props();

	const isAdmin = getUser().isAdmin;
	const flipDurationMs = 300;

	function handleDndConsider(e: any) {
		// Let Admin move all
		// if (isAdmin) {
		issues = e.detail.items;
		// }
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
	<span class="mx-3 mt-3 text-sm text-base-content/50 select-none">{title}</span>

	<ul
		class="h-full min-h-6 space-y-2 p-3"
		use:dndzone={{
			items: issues,
			flipDurationMs,
			dropTargetStyle: { outline: '2px solid rgb(42 126 255 / 61%)', borderRadius: '0.5rem' },
			dragDisabled: restricted,
			dropFromOthersDisabled: restricted
		}}
		onconsider={handleDndConsider}
		onfinalize={handleDndFinalize}
	>
		{#each issues as issue (issue.id)}
			<button
				oncontextmenu={(e) => openMenu(e, issue)}
				animate:flip={{ duration: flipDurationMs }}
				class="relative flex w-full flex-col rounded-lg border border-base-content/20 bg-base-100 p-3 text-left"
			>
				{#if issue[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
					<div class="custom-shadow-item p-3">
						<Item {issue} />
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
