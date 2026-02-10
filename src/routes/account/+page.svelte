<script lang="ts">
	const { data } = $props();
	const projects = $derived(data.projects);
</script>

<div class="mx-auto mt-4 max-w-7xl px-4">
	<div class=" mb-14">
		<h2>@{data.user.username}</h2>
		<h1 class="text-3xl font-bold">{data.user.fullname}</h1>
		<h2>{data.user.email}</h2>
	</div>

	<h1 class="text-4xl font-bold">Projects</h1>
	{#if projects.length < 1}
		No Projects
	{:else}
		<table class="data-table mt-2">
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
</div>

<style>
	.data-table {
		width: 100%;
		border: 1px solid #d6d6e7;
		border-collapse: separate;
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
