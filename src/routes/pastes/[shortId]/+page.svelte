<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import { formatDate, isAuthenticated, currentUser } from '$lib/utils';
	import type { Paste } from '$lib/types';

	let paste: Paste | null = null;
	let loading = true;
	let error = '';
	let isOwner = false;
	let passwordInput = '';
	let passwordRequired = false;
	let copied = false;

	onMount(async () => {
		await loadPaste();
	});

	async function copyToClipboard() {
		if (paste && paste.content) {
			await navigator.clipboard.writeText(paste.content);
			copied = true;

			// Reset the copied state after 2 seconds
			setTimeout(() => {
				copied = false;
			}, 2000);
		}
	}
	async function loadPaste() {
		const shortId = $page.params.shortId;
		loading = true;
		error = '';

		try {
			paste = await api.pastes.get(shortId);
			loading = false;

			// Check if user is the owner
			if ($isAuthenticated && $currentUser && paste.userId === $currentUser.id) {
				isOwner = true;
			}

			if (paste.isProtected) {
				passwordRequired = true;
			}
		} catch (e: any) {
			console.error('Error fetching paste:', e);
			if (e.message?.includes('password')) {
				passwordRequired = true;
			} else {
				error =
					e.message ||
					'Failed to load paste. It may not exist or you may not have permission to view it.';
			}
			loading = false;
		}
	}

	async function checkPassword() {
		const shortId = $page.params.shortId;
		loading = true;

		try {
			// This is a theoretical API endpoint that would check the password
			// You would need to implement this on your backend
			paste = await fetch(`http://localhost:3000/api/pastes/${shortId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ password: passwordInput })
			}).then((res) => {
				if (!res.ok) throw new Error('Incorrect password');
				return res.json();
			});

			passwordRequired = false;
			loading = false;
		} catch (e: any) {
			console.error('Error checking password:', e);
			error = e.message || 'Incorrect password';
			loading = false;
		}
	}

	async function deletePaste() {
		if (!confirm('Are you sure you want to delete this paste? This action cannot be undone.')) {
			return;
		}

		const shortId = $page.params.shortId;
		loading = true;

		try {
			await api.pastes.delete(shortId);
			goto('/pastes');
		} catch (e: any) {
			console.error('Error deleting paste:', e);
			error = e.message || 'Failed to delete paste';
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>{paste?.title || 'View Paste'} | PasteIt</title>
</svelte:head>

<div class="mx-auto max-w-6xl">
	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
		</div>
	{:else if passwordRequired}
		<div class="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
			<h2 class="mb-4 text-xl font-bold">Password Protected Paste</h2>
			<p class="mb-4">This paste is password protected. Please enter the password to view it.</p>

			{#if error}
				<div
					class="mb-4 rounded border border-red-400 bg-red-100 p-4 text-red-700 dark:border-red-700 dark:bg-red-900 dark:text-red-300"
				>
					{error}
				</div>
			{/if}

			<form on:submit|preventDefault={checkPassword} class="space-y-4">
				<div>
					<label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Password
					</label>
					<input
						type="password"
						id="password"
						bind:value={passwordInput}
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
					/>
				</div>

				<div>
					<button
						type="submit"
						class="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						disabled={loading}
					>
						{loading ? 'Checking...' : 'Submit'}
					</button>
				</div>
			</form>
		</div>
	{:else if error}
		<div
			class="rounded border border-red-400 bg-red-100 p-4 text-red-700 dark:border-red-700 dark:bg-red-900 dark:text-red-300"
		>
			{error}
		</div>
	{:else if paste}
		<div class="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
			<div class="p-6">
				<div class="flex items-start justify-between">
					<h1 class="mb-2 text-2xl font-bold">{paste.title || 'Untitled Paste'}</h1>

					<div class="flex space-x-2">
						<span
							class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
						>
							{paste.syntax}
						</span>

						{#if paste.visibility === 'private'}
							<span
								class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200"
							>
								Private
							</span>
						{:else if paste.visibility === 'unlisted'}
							<span
								class="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
							>
								Unlisted
							</span>
						{:else}
							<span
								class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200"
							>
								Public
							</span>
						{/if}
					</div>
				</div>

				<div class="mb-4 flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400">
					<span>Created: {formatDate(paste.createdAt)}</span>
					{#if paste.updatedAt !== paste.createdAt}
						<span class="mx-2">•</span>
						<span
							>Updated: {paste.updatedAt
								? formatDate(paste.updatedAt)
								: formatDate(paste.createdAt)}</span
						>
					{/if}
					{#if paste.expiresAt}
						<span class="mx-2">•</span>
						<span>Expires: {formatDate(paste.expiresAt)}</span>
					{/if}
				</div>
				<div
					class="relative mb-4 overflow-x-auto rounded bg-gray-100 p-4 font-mono text-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200"
					style="white-space: pre-wrap; word-wrap: break-word;"
				>
					<button
						on:click={copyToClipboard}
						class="absolute right-2 top-2 cursor-pointer rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						title="Copy to clipboard"
					>
						<div class="flex items-center gap-1">
							<svg
								fill="white"
								xmlns="http://www.w3.org/2000/svg"
								width="16px"
								height="16px"
								viewBox="0 0 52 52"
								enable-background="new 0 0 52 52"
								xml:space="preserve"
							>
								<path
									d="M44,2H18c-2.2,0-4,1.8-4,4v2h24c2.2,0,4,1.8,4,4v28h2c2.2,0,4-1.8,4-4V6C48,3.8,46.2,2,44,2z"
								/>
								<path
									d="M38,16c0-2.2-1.8-4-4-4H8c-2.2,0-4,1.8-4,4v30c0,2.2,1.8,4,4,4h26c2.2,0,4-1.8,4-4V16z M20,23
		c0,0.6-0.4,1-1,1h-8c-0.6,0-1-0.4-1-1v-2c0-0.6,0.4-1,1-1h8c0.6,0,1,0.4,1,1V23z M28,39c0,0.6-0.4,1-1,1H11c-0.6,0-1-0.4-1-1v-2
		c0-0.6,0.4-1,1-1h16c0.6,0,1,0.4,1,1V39z M32,31c0,0.6-0.4,1-1,1H11c-0.6,0-1-0.4-1-1v-2c0-0.6,0.4-1,1-1h20c0.6,0,1,0.4,1,1V31z"
								/>
							</svg>
							<span>{copied ? 'Copied!' : 'Copy'}</span>
						</div>
					</button>
					<code class="font-mono">{paste.content}</code>
				</div>

				{#if paste.tags && paste.tags.length > 0}
					<div class="mb-4">
						<div class="flex flex-wrap gap-1">
							{#each paste.tags as tag}
								<span class="rounded-full bg-gray-200 px-2 py-1 text-xs dark:bg-gray-700">
									{tag}
								</span>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<div class="flex items-center justify-between bg-gray-50 px-6 py-4 dark:bg-gray-700">
				<div class="flex space-x-3">
					<a
						href={`/pastes/${paste.shortId}/raw`}
						target="_blank"
						class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
					>
						Raw
					</a>

					{#if paste.userId}
						<a
							href={`/user/${paste.userId}`}
							class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
						>
							Author
						</a>
					{/if}
				</div>

				{#if isOwner}
					<div class="flex space-x-3">
						<a
							href={`/pastes/${paste.shortId}/edit`}
							class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-1 text-sm font-medium leading-4 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							Edit
						</a>

						<button
							on:click={deletePaste}
							class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-1 text-sm font-medium leading-4 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
						>
							Delete
						</button>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
