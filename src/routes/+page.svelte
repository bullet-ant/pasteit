<script lang="ts">
	import { onMount } from 'svelte';
	import { isAuthenticated } from '$lib/utils';
	import { api } from '$lib/api';
	import PasteCard from '$lib/components/PasteCard.svelte';
	import type { PastesResponse } from '$lib/types';

	let recentPastes: PastesResponse;
	let loading = true;
	let error = false;

	onMount(async () => {
		try {
			recentPastes = await api.pastes.recent();
			loading = false;
		} catch (e) {
			console.error('Error fetching recent pastes:', e);
			error = true;
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>PasteIt - Share Code Snippets</title>
</svelte:head>

<section class="py-12 text-center">
	<h1 class="mb-4 text-4xl font-bold">Welcome to PasteIt</h1>
	<p class="mb-8 text-xl">A simple, fast, and secure pastebin service</p>

	<div class="flex justify-center space-x-4">
		<a
			href="/pastes/new"
			class="rounded-md bg-blue-600 px-6 py-3 text-white shadow-md hover:bg-blue-700"
		>
			Create New Paste
		</a>
		<a
			href="/pastes/explore"
			class="rounded-md bg-gray-200 px-6 py-3 text-gray-800 shadow-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
		>
			Recent Pastes
		</a>
	</div>
</section>

<section class="py-8">
	<h2 class="mb-6 text-2xl font-bold">Recent Public Pastes</h2>

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div
				class="h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-blue-500"
			></div>
		</div>
	{:else if error}
		<div
			class="rounded border border-red-400 bg-red-100 p-4 text-red-700 dark:border-red-700 dark:bg-red-900 dark:text-red-300"
		>
			Failed to load recent pastes. Please try again later.
		</div>
	{:else if recentPastes && recentPastes.pastes.length === 0}
		<div class="rounded-lg bg-gray-100 p-6 text-center dark:bg-gray-800">
			<p>No pastes available yet. Be the first to create one!</p>
		</div>
	{:else if recentPastes}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each recentPastes.pastes as paste (paste.shortId)}
				<PasteCard {paste} />
			{/each}
		</div>
	{:else}
		<div
			class="rounded border border-red-400 bg-red-100 p-4 text-red-700 dark:border-red-700 dark:bg-red-900 dark:text-red-300"
		>
			Failed to load recent pastes.
		</div>
	{/if}

	<div class="mt-8 text-center">
		<a href="/pastes/explore" class="text-blue-600 hover:underline dark:text-blue-400"
			>View all pastes →</a
		>
	</div>
</section>

<section class="my-8 rounded-lg bg-white p-6 py-8 shadow-md dark:bg-gray-800">
	<h2 class="mb-4 text-2xl font-bold">Features</h2>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
		<div class="p-4">
			<div class="mb-2 text-2xl text-blue-600 dark:text-blue-400">🔒</div>
			<h3 class="mb-2 text-xl font-semibold">Private Pastes</h3>
			<p>
				Create private pastes that only you can access, or add password protection for extra
				security.
			</p>
		</div>

		<div class="p-4">
			<div class="mb-2 text-2xl text-blue-600 dark:text-blue-400">💻</div>
			<h3 class="mb-2 text-xl font-semibold">Syntax Highlighting</h3>
			<p>Support for multiple programming languages with beautiful syntax highlighting.</p>
		</div>

		<div class="p-4">
			<div class="mb-2 text-2xl text-blue-600 dark:text-blue-400">⏱️</div>
			<h3 class="mb-2 text-xl font-semibold">Expiration Control</h3>
			<p>Set pastes to expire after a certain time for temporary sharing needs.</p>
		</div>
	</div>
</section>
