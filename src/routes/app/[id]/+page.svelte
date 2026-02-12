<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { MOCK_DATA } from '$lib';
	import Board from '$lib/components/board/Board.svelte';
	import { getUser } from '$lib/store.svelte.js';
	import { Plus } from '@lucide/svelte';
	const { data } = $props();

	const appState = $derived([...(data.issues as any[])]);
	const isAdmin = getUser().isAdmin;

	const todos = $derived(appState.filter((v) => v.status === 'todo'));
	const in_progress = $derived(appState.filter((v) => v.status === 'in_progress'));
	const in_review = $derived(appState.filter((v) => v.status === 'in_review'));
	const done = $derived(appState.filter((v) => v.status === 'done'));

	let modalRef: HTMLDialogElement | undefined;
</script>

<div class="width mx-auto w-full max-w-7xl flex flex-col">
	<div class="breadcrumbs px-3 text-sm">
		<ul>
			<li><a href="/app">Projects</a></li>
			<li>{data.project?.name}</li>
		</ul>
	</div>
	<div class="mb-4 flex items-center justify-between px-3">
		<h1 class="text-3xl font-semibold text-primary">Board</h1>
		<button class="btn btn-primary" onclick={() => modalRef?.showModal()}>Create new Issue</button>
	</div>
	<div class="my-3 inline-flex w-full space-x-3 overflow-x-auto flex-1 px-3">
		<Board title="TO DO" issues={todos} />
		<Board title="IN PROGRESS" issues={in_progress} />
		<Board title="IN REVIEW" issues={in_review} />
		<Board title="DONE" issues={done} restricted={!isAdmin} />
	</div>
</div>

<dialog bind:this={modalRef} class="modal">
	<div class="modal-box flex max-w-md p-0">
		<form
			class="mt-2 flex w-full flex-col p-6"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						await invalidateAll();
						modalRef?.close();
					} else if (result.type == 'failure') {
						console.log(result?.data);
					} else if (result.type == 'error') {
						alert('Unknown error occured');
					}
				};
			}}
			method="POST"
			action="?/newIssue"
		>
			<h2 class="text-2xl font-semibold">Create a new Issue</h2>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Issue Description</legend>
				<input
					name="description"
					type="text"
					class="input w-full"
					autocomplete="off"
					placeholder="Type here"
					required
				/>
			</fieldset>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Issue Type</legend>
				<select class="select w-full" name="type">
					<option selected value="task">Task</option>
					<option value="bug">Bug</option>
					<option value="story">Story</option>
				</select>
			</fieldset>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Issue Priority</legend>
				<select class="select w-full" name="priority">
					<option selected value="low">Low</option>
					<option value="medium">Medium</option>
					<option value="high">High</option>
					<option value="critical">Critical</option>
				</select>
			</fieldset>
			{#if data.isAdmin}
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Issue Assigne</legend>
					<select class="select w-full" name="assignee_username">
						<option selected value="null">None</option>
						{#each data.membersUsername as member}
							<option value={member.username}>{member.fullname} (@{member.username})</option>
						{/each}
					</select>
				</fieldset>
			{/if}
			<div class="mt-6 flex justify-end gap-2">
				<button class="btn" onclick={() => modalRef?.close()}>Cancel</button>
				<button type="submit" class="btn btn-primary"><Plus /> Create Issue</button>
			</div>
			<p id="form_errors"></p>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<style>
	.width {
		min-width: calc(100% - var(--container-3xs));
	}
</style>
