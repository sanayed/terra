<script lang="ts">
	import { Settings, Users } from '@lucide/svelte';

	let { children, data } = $props();
</script>

<main class="flex h-full">
	<aside class="h-sidebar flex min-w-3xs flex-col border-r border-r-base-content/20 p-2">
		<div
			class="m-2 flex flex-col items-start rounded-xl border border-primary/30 bg-primary/10 px-3"
		>
			<h2 class="pt-3 text-3xl font-semibold">{data.project?.name}</h2>
			<span class="pb-3">{data.project?.description}</span>
		</div>

		<div class="flex flex-1 flex-col">
			<h3 class="divider divider-start pl-4 text-lg font-semibold text-primary">Boards</h3>
			<a class="btn w-full justify-start btn-ghost" href={`/app/${data.project?.id}/`}> Main </a>

			<div class="divider"></div>
			<a class="btn w-full justify-start btn-ghost" href={`/app/${data.project?.id}/members`}>
				<Users />
				Members
			</a>
		</div>
		<div>
			<a class="btn w-full justify-start btn-ghost" href={`/app/${data.project?.id}/settings`}>
				<Settings />
				Settings
			</a>
		</div>
	</aside>
	{@render children()}
</main>

<style>
	.h-sidebar {
		height: calc(100vh - var(--header-height));
	}
</style>
