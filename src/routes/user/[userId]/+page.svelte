<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { api } from '$lib/api';
	import { currentUser, isAuthenticated } from '$lib/utils';
	import PasteCard from '$lib/components/PasteCard.svelte';
	import type { Paste, User } from '$lib/types';

	let pastes: Paste[] = [];
	let profileUser: User | null = null;
	let loading = true;
	let error = '';
	let isOwner = false;

	onMount(async () => {
		await loadUserProfile();
	});

	async function loadUserProfile() {
		const userId = $page.params.userId;
		loading = true;
		error = '';

		try {
			// Check if this is the current user's profile
			if ($isAuthenticated && $currentUser && $currentUser._id === userId) {
				isOwner = true;
				profileUser = $currentUser;
			} else {
				const user = await api.users.get(userId);
				profileUser = {
					_id: user._id,
					username: user.username,
					email: user.email,
					createdAt: user.createdAt
				};
			}

			// Load user's pastes
			const allPastes = await api.users.getPastes(userId);
			pastes = allPastes.pastes;

			loading = false;
		} catch (e: any) {
			console.error('Error loading user profile:', e);
			error = e.message || 'Failed to load user profile. Please try again later.';
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>{profileUser?.username || 'User'}'s Pastes | PasteIt</title>
</svelte:head>

<div class="mx-auto max-w-4xl">
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
	{:else if profileUser}
		<div class="mb-8">
			<div class="mb-4 flex items-center justify-between">
				<h1 class="text-3xl font-bold">
					{isOwner ? 'My Pastes' : `${profileUser.username}'s Pastes`}
				</h1>

				{#if isOwner}
					<a
						href="/pastes/new"
						class="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
					>
						New Paste
					</a>
				{/if}
			</div>

			{#if isOwner}
				<p class="text-gray-600 dark:text-gray-400">Manage all your pastes in one place</p>
			{:else}
				<p class="text-gray-600 dark:text-gray-400">
					Public pastes shared by {profileUser.username}
				</p>
			{/if}
		</div>

		{#if pastes.length === 0}
			<div class="rounded-lg bg-gray-100 p-6 text-center dark:bg-gray-800">
				<p>
					{isOwner
						? "You haven't created any pastes yet."
						: `${profileUser.username} hasn't shared any pastes yet.`}
				</p>
				{#if isOwner}
					<a href="/pastes/new" class="mt-4 text-blue-600 hover:underline dark:text-blue-400">
						Create your first paste
					</a>
				{/if}
			</div>
		{:else if pastes}
			<div class="space-y-6">
				{#each pastes as paste (paste.shortId)}
					<PasteCard {paste} />
				{/each}
			</div>

			<!-- Pagination could be added here if needed -->
		{/if}
	{/if}
</div>
