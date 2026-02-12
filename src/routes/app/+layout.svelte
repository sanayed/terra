<script lang="ts">
	import ContextMenu from '$lib/components/ContextMenu.svelte';
	import Header from '$lib/components/Header.svelte';
	import { setUser } from '$lib/store.svelte.js';

	let { children, data } = $props();
</script>

<svelte:head><title>Terra - Projects</title></svelte:head>
<Header username={data.user.username} email={data.user.email} />
<main class="min-h-dvh pt-(--header-height)">
	{@render children()}
</main>
<ContextMenu />
