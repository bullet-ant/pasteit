<script lang="ts">
	import { onMount } from 'svelte';
	import { api } from '$lib/api';
	import PasteCard from '$lib/components/PasteCard.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import type { Paste, PastesResponse } from '$lib/types';

	let pastes: PastesResponse | null = null;
	let loading = true;
	let error = false;
	let searchQuery = '';

	onMount(async () => {
		try {
			pastes = await api.pastes.recent();
			loading = false;
		} catch (e) {
			console.error('Error fetching pastes:', e);
			error = true;
			loading = false;
		}
	});

	async function handleSearch(event: any) {
		searchQuery = event.detail;
		loading = true;

		try {
			pastes = await api.pastes.search(searchQuery);
			loading = false;
		} catch (e) {
			console.error('Error searching pastes:', e);
			error = true;
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Browse Pastes | PasteIt</title>
</svelte:head>

<div class="mx-auto max-w-4xl">
	<h1 class="mb-6 text-3xl font-bold">Browse Pastes</h1>

	<div class="mb-6">
		<SearchBar value={searchQuery} on:search={handleSearch} />
	</div>

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
		</div>
	{:else if error}
		<div
			class="rounded border border-red-400 bg-red-100 p-4 text-red-700 dark:border-red-700 dark:bg-red-900 dark:text-red-300"
		>
			Failed to load pastes. Please try again later.
		</div>
	{:else if pastes?.pastes.length === 0}
		<div class="rounded-lg bg-gray-100 p-6 text-center dark:bg-gray-800">
			{searchQuery
				? `No pastes found matching "${searchQuery}"`
				: 'No pastes available yet. Be the first to create one!'}
		</div>
	{:else if pastes}
		<div class="space-y-6">
			{#each pastes.pastes as paste (paste.shortId)}
				<PasteCard {paste} />
			{/each}
		</div>
	{:else}
		<p>Something went wrong. Please try again later.</p>
	{/if}
</div>
