<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import { formatDate, isAuthenticated, currentUser } from '$lib/utils';
	import type { Paste } from '$lib/types';
	import { PUBLIC_API_BASE } from '$env/static/public';

	let paste: Paste | null = null;
	let loading = true;
	let error = '';
	let isOwner = false;
	let passwordInput = '';
	let passwordRequired = false;
	let copied = false;
	let linkCopied = false;

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

	async function shareLink() {
		if (paste) {
			const url = `${window.location.origin}/pastes/${paste.shortId}`;
			await navigator.clipboard.writeText(url);
			linkCopied = true;

			// Reset the state after 2 seconds
			setTimeout(() => {
				linkCopied = false;
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
			if ($isAuthenticated && $currentUser && paste.userId === $currentUser._id) {
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
			paste = await fetch(`${PUBLIC_API_BASE}/pastes/${shortId}`, {
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
			<div
				class="h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-blue-500"
			></div>
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
					<label
						for="paste-password"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						Password
					</label>
					<input
						type="password"
						id="paste-password"
						bind:value={passwordInput}
						required
						class="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
					/>
				</div>

				<div>
					<button
						type="submit"
						class="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
					style="white-space: pre-wrap; word-break: break-word; tab-size: 4;"
				>
					<button
						on:click={copyToClipboard}
						class="absolute top-2 right-2 cursor-pointer rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
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
					<code class="block font-mono">{paste.content}</code>
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
					<!-- <a
						href={`/pastes/${paste.shortId}/raw`}
						target="_blank"
						class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm leading-4 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
					>
						Raw
					</a> -->

					{#if paste.userId}
						<a
							href={`/user/${paste.userId}`}
							class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm leading-4 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
						>
							Author
						</a>
					{/if}
				</div>

				<div class="flex space-x-3">
					<button
						on:click={shareLink}
						class="inline-flex items-center rounded-md border border-gray-300 {linkCopied
							? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
							: 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200'} px-3 py-1 text-sm leading-4 font-medium shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:hover:bg-gray-700"
					>
						{#if linkCopied}
							<span class="flex items-center">
								<svg
									class="mr-1 h-4 w-4"
									viewBox="0 0 20 20"
									fill="currentColor"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fill-rule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clip-rule="evenodd"
									/>
								</svg>
								Copied!
							</span>
						{:else}
							<span>Share</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="ml-1 h-4 w-4"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<circle cx="18" cy="5" r="3"></circle>
								<circle cx="6" cy="12" r="3"></circle>
								<circle cx="18" cy="19" r="3"></circle>
								<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
								<line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
							</svg>
						{/if}
					</button>

					{#if isOwner}
						<a
							href={`/pastes/${paste.shortId}/edit`}
							class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-1 text-sm leading-4 font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
						>
							Edit
						</a>

						<button
							on:click={deletePaste}
							class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-1 text-sm leading-4 font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
						>
							Delete
						</button>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
