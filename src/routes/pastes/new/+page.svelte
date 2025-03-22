<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import PasteForm from '$lib/components/PasteForm.svelte';
	import { api } from '$lib/api';
	import { isAuthenticated, currentUser } from '$lib/utils';

	let loading = false;
	let error = '';

	onMount(() => {
		if (!$isAuthenticated) {
			goto('/auth/login?redirect=/pastes/new');
		}
	});

	async function handleSubmit(event: any) {
		const pasteData = event.detail;
		loading = true;
		error = '';

		try {
			const newPaste = await api.pastes.create({
				...pasteData,
				userId: $currentUser?.id || null
			});
			goto(`/pastes/${newPaste.paste?.shortId}`);
		} catch (e: any) {
			console.error('Error creating paste:', e);
			error = e.message || 'Failed to create paste. Please try again.';
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Create New Paste | PasteIt</title>
</svelte:head>

<div class="mx-auto max-w-6xl">
	<h1 class="mb-6 text-3xl font-bold">Create New Paste</h1>

	{#if error}
		<div
			class="mb-6 rounded border border-red-400 bg-red-100 p-4 text-red-700 dark:border-red-700 dark:bg-red-900 dark:text-red-300"
		>
			{error}
		</div>
	{/if}

	<div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
		<PasteForm on:submit={handleSubmit} {loading} />
	</div>
</div>
