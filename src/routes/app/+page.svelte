<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Plus } from '@lucide/svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	let projects = $derived(data.projects);

	let modalRef: HTMLDialogElement | undefined;
</script>

<main class="mx-auto max-w-7xl px-4">
	<div class="mt-4 flex items-center justify-between">
		<h2 class="text-2xl font-semibold">Browse Projects</h2>
		<button id="create" class="btn btn-primary" onclick={() => modalRef?.showModal()}>
			<Plus /> Create New Project
		</button>
	</div>

	{#if projects.length < 1}
		No Projects
	{:else}
		<table class="data-table mt-8">
			<thead>
				<tr>
					<th>Name</th>
					<th>Description</th>
					<th>Project Lead</th>
					<th>Status</th>
				</tr>
			</thead>
			<tbody>
				{#each projects as project}
					<tr>
						<td><a href={`/app/${project.id}/`}>{project.name}</a></td>
						<td>{project.description}</td>
						<td>{project.owner_name}</td>
						<td style="display:flex; align-items:center;">{project.status.toUpperCase()}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</main>

<dialog bind:this={modalRef} class="modal">
	<div class="modal-box flex min-w-3xl p-0">
		<form
			class="mt-2 flex flex-col p-6"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						modalRef?.close();
					} else if (result.type === 'redirect') {
						goto(result.location);
					}
				};
			}}
			method="POST"
		>
			<h2 class="text-2xl font-semibold">Create a new Project</h2>
			<p class="mb-6 text-sm opacity-70">
				You can change these details anytime in the project settings
			</p>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Project Name</legend>
				<input
					name="name"
					type="text"
					class="input w-full"
					autocomplete="off"
					placeholder="Type here"
					required
				/>
			</fieldset>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Project Description</legend>
				<input
					type="text"
					class="input w-full"
					name="description"
					autocomplete="off"
					placeholder="Type here"
					required
				/>
			</fieldset>
			<div class="mt-6 flex justify-end gap-2">
				<button class="btn" onclick={() => modalRef?.close()}>Cancel</button>
				<button type="submit" class="btn btn-primary"><Plus /> Create Project</button>
			</div>
			<p id="form_errors"></p>
		</form>
		<div class="flex-1 bg-primary"></div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<style>
	.data-table {
		width: 100%;
		border: 1px solid #d6d6e7;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
		background: #fff;
		border-radius: var(--radius);
		overflow: hidden;
	}

	.data-table thead {
		background: #f5f7fa;
	}

	.data-table th,
	.data-table td {
		padding: 12px 16px;
		text-align: left;
	}

	.data-table th {
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #555;
	}

	.data-table tbody tr {
		border-top: 1px solid #eee;
	}

	.data-table tbody tr:hover {
		background: #f9fafb;
	}
</style>
