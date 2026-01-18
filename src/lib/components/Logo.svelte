<script lang="ts">
	import terra from '$lib/assets/terra.svg';
	import type { HTMLImgAttributes } from 'svelte/elements';
	const props: HTMLImgAttributes = $props();
</script>

<img
	src={terra}
	{...props}
	alt="logo"
	draggable="false"
	oncontextmenu={(e) => e.preventDefault()}
/>
