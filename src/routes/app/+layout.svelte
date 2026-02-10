<script lang="ts">
	import Header from '$lib/components/Header.svelte';

	let { children, data } = $props();
</script>

<Header username={data.user.username} email={data.user.email} />
<main class="min-h-dvh pt-(--header-height)">
	{@render children()}
</main>
