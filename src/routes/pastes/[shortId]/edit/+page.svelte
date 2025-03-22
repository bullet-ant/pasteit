<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import { isAuthenticated, currentUser } from '$lib/utils';
	import PasteForm from '$lib/components/PasteForm.svelte';
	import type { Paste } from '$lib/types';

	let paste: Paste | null = null;
	let loading = true;
	let submitting = false;
	let error = '';

	onMount(async () => {
		if (!$isAuthenticated) {
			goto('/auth/login?redirect=' + $page.url.pathname);
			return;
		}

		await loadPaste();
	});

	async function loadPaste() {
		const shortId = $page.params.shortId;
		loading = true;
		error = '';

		try {
			paste = await api.pastes.get(shortId);

			// Check if user is the owner
			if (!$isAuthenticated || !$currentUser || paste.userId !== $currentUser.id) {
				error = 'You do not have permission to edit this paste.';
			}

			loading = false;
		} catch (e: any) {
			console.error('Error fetching paste:', e);
			error =
				e.message ||
				'Failed to load paste. It may not exist or you may not have permission to edit it.';
			loading = false;
		}
	}

	async function handleSubmit(event: any) {
		const pasteData = event.detail;
		submitting = true;
		error = '';

		try {
			const updatedPaste = await api.pastes.update($page.params.shortId, pasteData);
			goto(`/pastes/${updatedPaste.shortId}`);
		} catch (e: any) {
			console.error('Error updating paste:', e);
			error = e.message || 'Failed to update paste. Please try again.';
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Edit Paste | PasteIt</title>
</svelte:head>

<div class="mx-auto max-w-4xl">
	<h1 class="mb-6 text-3xl font-bold">Edit Paste</h1>

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
		</div>
	{:else if error}
		<div
			class="rounded border border-red-400 bg-red-100 p-4 text-red-700 dark:border-red-700 dark:bg-red-900 dark:text-red-300"
		>
			{error}
		</div>
	{:else if paste}
		<div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
			<PasteForm {paste} submitText="Update Paste" on:submit={handleSubmit} loading={submitting} />
		</div>
	{/if}
</div>
