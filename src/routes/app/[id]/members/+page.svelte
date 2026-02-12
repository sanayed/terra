<script lang="ts">
	import { enhance } from '$app/forms';
	import { Plus, UserMinus } from '@lucide/svelte';

	const { data } = $props();

	let formError = $state('');

	let modalRef: HTMLDialogElement | undefined = $state();
</script>

<section class="mx-auto w-full max-w-7xl">
	<div class="breadcrumbs px-3 text-sm">
		<ul>
			<li><a href="/app">Projects</a></li>
			<li>{data.project?.name}</li>
		</ul>
	</div>

	<div class="mb-4 flex items-center justify-between px-3">
		<h1 class="text-3xl font-semibold text-primary">Members</h1>
		{#if data.isAdmin}
			<button class="btn btn-primary" onclick={() => modalRef?.showModal()}>Invite</button>
		{/if}
	</div>

	<div class="overflow-x-auto">
		<table class="table">
			<!-- head -->
			<thead>
				<tr>
					<th></th>
					<th>Name</th>
					<th>Email</th>
					<th>Role</th>
					{#if data.isAdmin}
						<th>Action</th>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each data.members as member, idx (member.id)}
					<tr>
						<th>{idx + 1}</th>
						<td>{member.fullname} (@{member.username})</td>
						<td>{member.email}</td>
						<td>{member.role}</td>
						{#if data.isAdmin}
							<th>
								<button class="btn btn-error" disabled={member.id == data.project.created_by}>
									<UserMinus />
									Kick
								</button>
							</th>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>

{#if data.isAdmin}
	<dialog bind:this={modalRef} class="modal">
		<div class="modal-box flex max-w-md p-0">
			<form
				class="mt-2 flex w-full flex-col p-6"
				method="POST"
				action="?/invite"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							formError = '';
							modalRef?.close();
						} else if (result.type == 'failure') {
							formError = result?.data?.message as string;
						}
					};
				}}
			>
				<h2 class="text-2xl font-semibold">Invite a member</h2>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Invite By Username</legend>
					<input
						name="username"
						type="text"
						class="input w-full"
						autocomplete="off"
						placeholder="Enter username here"
						required
					/>
				</fieldset>

				<p class="text-xs text-error">{formError}</p>
				<div class="mt-3 flex justify-end gap-2">
					<button type="button" class="btn" onclick={() => modalRef?.close()}> Cancel </button>
					<button type="submit" class="btn btn-primary"><Plus /> Invite Member</button>
				</div>
			</form>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
{/if}
