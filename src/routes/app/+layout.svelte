<script lang="ts">
	import Header from '$lib/components/Header.svelte';

	let { children } = $props();
</script>

<Header />
<main class="min-h-dvh pt-(--header-height)">
	{@render children()}
</main>
