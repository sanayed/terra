<script lang="ts">
	import { DragDropProvider, KeyboardSensor, PointerSensor } from '@dnd-kit/svelte';
	import DragColumn from './drag-column.svelte';
	import { MOCK_DATA, type Issue, type IssueStatus } from '$lib';
	import { move } from '@dnd-kit/helpers';
	import { updateIssueStatus } from '$lib/utils/board';

	let { issues }: { issues: Issue[] } = $props();

	function initItems() {
		let temp = new Map<IssueStatus, Issue[]>(
			Object.entries({
				todo: [],
				in_progress: [],
				in_review: [],
				done: []
			}) as [IssueStatus, Issue[]][]
		);

		issues.forEach((issue) => {
			temp.set(issue.status, [...(temp.get(issue.status) || []), issue]);
		});

		return Object.fromEntries(temp) as Record<IssueStatus, Issue[]>;
	}

	let items: Record<IssueStatus, Issue[]> = $state(initItems());
	let snapshot = $state(structuredClone(initItems()));
	$effect(() => {
		console.log(issues);
		items = initItems();
		snapshot = structuredClone(initItems());
	});

	const sensors = [
		PointerSensor.configure({
			activatorElements(source) {
				return [source.element, source.handle];
			}
		}),
		KeyboardSensor
	];

	function onDragStart() {
		// snapshot = structuredClone(items);
	}

	function onDragOver(event: any) {
		const { source } = event.operation;
		if (source && source.type === 'column') return;
		items = move(items, event);
	}

	function onDragEnd(event: any) {
		if (event.canceled) {
			items = snapshot;
			return;
		}

		let { issue, group }: { issue: Issue; group: IssueStatus } = event.operation.source.data;
		if (issue) {
			console.log($state.snapshot(issue));
			issue.status = group;
			updateIssueStatus(issue.id, group);
		}
	}
</script>

<DragDropProvider {sensors} {onDragStart} {onDragOver} {onDragEnd}>
	<div
		class="mb-2 grid w-full flex-1 gap-2 px-2"
		style="grid-template-columns: repeat({Object.keys(items).length}, 1fr);"
	>
		{#each Object.entries(items) as [key, columnItems], index (key)}
			<DragColumn id={key} items={columnItems} {index} />
		{/each}
	</div>
</DragDropProvider>
