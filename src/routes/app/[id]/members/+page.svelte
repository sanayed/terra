<script lang="ts">
	import { UserMinus } from '@lucide/svelte';

	const { data } = $props();
	const isAdmin = $derived(data.isAdmin);
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
		<button class="btn btn-primary">Invite</button>
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
					{#if isAdmin}
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
						{#if isAdmin}
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
