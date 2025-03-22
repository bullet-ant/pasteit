<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { api } from '$lib/api';

	let content = '';
	let loading = true;
	let error = '';

	onMount(async () => {
		const shortId = $page.params.shortId;

		try {
			content = await api.pastes.getRaw(shortId);
			loading = false;
		} catch (e: any) {
			console.error('Error fetching raw paste:', e);
			error = e.message || 'Failed to load paste content';
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Raw Paste | PasteIt</title>
	<style>
		body {
			font-family: monospace;
			white-space: pre-wrap;
			word-wrap: break-word;
			padding: 20px;
		}
	</style>
</svelte:head>

{#if loading}
	Loading paste content...
{:else if error}
	Error: {error}
{:else}
	{content}
{/if}
