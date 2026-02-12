<script lang="ts">
	import { closeContextMenu,  contextMenu,  type ContextMenuItem } from '$lib/store.svelte';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	let menuEl: HTMLDivElement;
	

	function onItemClick(item: ContextMenuItem) {
		if (!item.disabled) {
			item.action();
			closeContextMenu();
		}
	}

	// Close on outside click
	function handleClickOutside(event: MouseEvent) {
		if (menuEl && !menuEl.contains(event.target as Node)) {
			closeContextMenu();
		}
	}

	onMount(() => {
		window.addEventListener('click', handleClickOutside);
		return () => window.removeEventListener('click', handleClickOutside);
	});
</script>

{#if contextMenu.visible}
	<div
		bind:this={menuEl}
		class="fixed top-0 left-0 z-50 w-48 rounded-box border border-base-300 bg-base-100 p-1 shadow-md"
		style="transform: translate({contextMenu.x}px, {contextMenu.y}px)"
		transition:fly={{ y: -4, duration: 100 }}
	>
		{#each contextMenu.items as item}
			<button
				class="w-full text-left px-3 py-2 hover:bg-base-300 rounded-field text-sm"
				on:click={() => onItemClick(item)}
				disabled={item.disabled}
			>
				{item.label}
			</button>
		{/each}
	</div>
{/if}

<style>
	button{
		text-align: left;
	}
</style>
