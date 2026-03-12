<script lang="ts">
	import { move } from '@dnd-kit/helpers';
	import Item from './Item.svelte';
	import { sensors, type Issue } from '$lib';
	import Droppable from './Droppable.svelte';

	let { issues }: { issues: Issue[] } = $props();

	type Board = Record<string, Issue[]>;

	function issuesToBoard(issues: Issue[]): Board {
		return {
			todo: issues.filter((v) => v.status === 'todo'),
			in_progress: issues.filter((v) => v.status === 'in_progress'),
			in_review: issues.filter((v) => v.status === 'in_review'),
			done: issues.filter((v) => v.status === 'done')
		};
	}

	let board = $state<Board>(issuesToBoard(issues));

	$effect(() => {
		board = issuesToBoard(issues);
	});
</script>

<DragDropProvider
	{sensors}
	modifiers={[RestrictToWindowEdges]}
	onDragOver={(event, a) => {
		board = move(board, event);
	}}
	onDragEnd={async (event) => {
		const id = event.operation.target?.id;
		const status = event.operation.source?.data.group;
		let res = await fetch('/api/issues', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ issue_id: id, status, project_id: issues[0].project_id })
		});
		res = await res.json();
		console.log(res);
	}}
>
	<div class="flex h-full gap-3 px-3">
		{@render drawBoard('todo', 'TODO', board.todo)}
		{@render drawBoard('in_progress', 'IN PROGRESS', board.in_progress)}
		{@render drawBoard('in_review', 'IN REVIEW', board.in_review)}
		{@render drawBoard('done', 'DONE', board.done)}
	</div>

	<DragOverlay>
		{#snippet children(source)}
			{@const issue = board[source.data.group].find((i) => i.id === source.id)!}
			<Item id={issue.id} {issue} index={0} isOverlay />
		{/snippet}
	</DragOverlay>
</DragDropProvider>

{#snippet drawBoard(id: string, title: string, issues: Issue[])}
	<Droppable
		{id}
		type="column"
		accept="item"
		class="min-w-60 flex-1 flex-col rounded-lg border border-base-content/20 bg-base-300 p-2 transition-all"
	>
		<span class="pt-1 pb-2 text-sm text-base-content/50 select-none">{title}</span>
		<div class="min-h-40 space-y-2">
			{#each issues as issue, index (issue.id)}
				<Item
					{issue}
					id={issue.id}
					index={() => index}
					group={id}
					data={{ group: id }}
					type="item"
				/>
			{/each}
		</div>
	</Droppable>
{/snippet}
