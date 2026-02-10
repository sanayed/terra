<script lang="ts">
	import { enhance } from '$app/forms';
	import { InfoIcon } from '@lucide/svelte';

	const { data, form } = $props();

	let name = $derived(data.project?.name);
	let description = $derived(data.project?.description);
	const isAdmin = $derived(data.isAdmin);
</script>

<section class="mx-auto w-full max-w-7xl">
	<div class="breadcrumbs px-3 text-sm">
		<ul>
			<li><a href="/app">Projects</a></li>
			<li>{data.project?.name}</li>
		</ul>
	</div>
	{#if !isAdmin}
		<div role="alert" class="mx-3 my-5 alert border border-neutral-200">
			<InfoIcon />
			<span>You cant change project info unless you are admin.</span>
		</div>
	{/if}
	<div class="mb-4 flex items-center justify-between px-3">
		<h1 class="text-3xl font-semibold text-primary">Settings</h1>
	</div>

	{#if form?.error}
		<div role="alert" class="mx-3 my-5 alert border border-neutral-200 alert-error">
			<InfoIcon />
			<span>Error: {form?.error}</span>
		</div>
	{/if}

	<div class="flex-1 px-3">
		<form
			action="?/projectUpdate"
			method="POST"
			use:enhance={() => {
				return async ({ result }) => {
					if ((result.type = 'success')) {
						alert('Project Info updated');
					}
				};
			}}
		>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Project Name</legend>
				<input
					name="name"
					id="name"
					type="text"
					class="input"
					bind:value={name}
					disabled={!isAdmin}
					required
				/>
			</fieldset>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Project description</legend>
				<input
					name="description"
					id="description"
					type="text"
					class="input"
					bind:value={description}
					disabled={!isAdmin}
					required
				/>
			</fieldset>
			<button class="btn mt-4 btn-primary" type="submit">Save</button>
		</form>
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Ownership transfer</legend>
			<input
				name="description"
				id="description"
				type="text"
				class="input"
				bind:value={description}
				disabled={!isAdmin}
			/>
		</fieldset>
		<div class="card my-4 mt-10 flex flex-col border border-error bg-error/20 p-4">
			<h3 class="text-lg font-semibold text-error">Danger Zone</h3>
			<p>Once you delete a project, there is no going back. Please be certain.</p>
			<form method="POST" action="?/deleteProject" use:enhance>
				<button
					type="submit"
					class="btn mt-4 w-fit btn-outline btn-error"
					onclick={(e) => {
						if (
							!confirm(
								'Are you sure you want to delete this project? This action cannot be undone.'
							)
						) {
							e.preventDefault();
						}
					}}
				>
					Delete Project
				</button>
			</form>
		</div>
	</div>
</section>
