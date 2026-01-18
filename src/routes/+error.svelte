<script lang="ts">
	import './layout.css';
	import { page } from '$app/state';
</script>

<main class="flex min-h-screen flex-col items-center justify-center select-none">
	<h1 class="text-9xl font-bold">{page.status}</h1>
	<div class="text-3xl">{page.error?.message}</div>
</main>
