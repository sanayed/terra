<script lang="ts">
	import DragItem from './drag-item.svelte';
	import type { Issue } from '$lib';
	import { CollisionPriority } from '@dnd-kit/abstract';
	import { createSortable } from '@dnd-kit/svelte/sortable';

	let { id, items, index }: { id: string; items: Issue[]; index: number } = $props();

	const sortable = createSortable({
		get id() {
			return id;
		},
		get index() {
			return index;
		},
		accept: ['column', 'item'],
		collisionPriority: CollisionPriority.High,
		type: 'column'
	});
</script>

<ul
	{@attach sortable.attach}
	class="flex-1 rounded-lg border border-base-content/20 bg-base-300 p-2"
>
	<span class="pt-1 pb-2 text-sm text-base-content/50 select-none"
		>{id.toUpperCase().replaceAll('_', ' ')}</span
	>
	{#each items as item, itemIndex (item.id)}
		<DragItem id={item.id} issue={item} column={id} index={itemIndex} />
	{/each}
</ul>
