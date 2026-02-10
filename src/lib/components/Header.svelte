<script>
	import { Bell, User } from '@lucide/svelte';
	import Logo from './Logo.svelte';
</script>

<header
	class="bg-base fixed top-0 right-0 left-0 flex h-(--header-height) items-center justify-between border-b border-b-base-content/20 px-4"
>
	<!-- <h2 class="text-3xl font-bold text-primary">terra.</h2> -->
	<Logo width={60} />
	<input
		type="search"
		name="search"
		id="search"
		class="input input-sm min-w-md"
		placeholder="Search here"
	/>
	<div>
		<button class="btn btn-circle btn-ghost"><Bell /></button>
		<a class="btn btn-circle btn-ghost" href="/account"><User /></a>
	</div>
</header>
