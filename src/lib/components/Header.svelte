<script lang="ts">
	import { Bell, User } from '@lucide/svelte';
	import Logo from './Logo.svelte';

	let { username, email }: { username: string; email: string } = $props();
</script>

<header
	class="bg-base fixed top-0 right-0 left-0 flex h-(--header-height) items-center justify-between border-b border-b-base-content/20 px-4"
>
	<!-- <h2 class="text-3xl font-bold text-primary">terra.</h2> -->
	<a href="/app">
		<Logo width={60} />
	</a>
	<input
		type="search"
		name="search"
		id="search"
		class="input input-sm min-w-md"
		placeholder="Search here"
	/>
	<div class="flex hidden sm:block">
		<button class="btn btn-circle btn-ghost"><Bell /></button>
		<div class="tooltip tooltip-left">
			<div class="tooltip-content">
				<p>{username} - {email}</p>
			</div>

			<a class="btn btn-circle btn-ghost" href="/account"><User /></a>
		</div>
	</div>
</header>
