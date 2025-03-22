<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Paste } from '$lib/types';
	import { getSyntaxOptions } from '$lib/utils';

	export let paste: Partial<Paste> = {
		title: '',
		content: '',
		syntax: 'plaintext',
		visibility: 'public',
		expiresAt: '1h',
		password: null
	};

	export let loading = false;

	const dispatch = createEventDispatcher();
	const syntaxOptions = getSyntaxOptions();

	let expiryOptions = [
		{ value: '1h', label: '1 Hour' },
		{ value: '1d', label: '1 Day' },
		{ value: '1w', label: '1 Week' },
		{ value: '1m', label: '1 Month' },
		{ value: '1y', label: '1 Year' }
	];
	let selectedExpiry = expiryOptions[0].value;

	function adjustHeight(event: Event) {
		const textarea = event.target as HTMLTextAreaElement;
		textarea.style.height = 'auto'; // Reset height to calculate the new height
		textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on scrollHeight
	}

	function handleExpiryChange(event: any) {
		const value = event.target.value;
		selectedExpiry = value;
	}

	function calculateExpiry() {
		const now = new Date();
		let expiryDate = new Date(now);

		if (selectedExpiry === '1h') {
			expiryDate.setHours(now.getHours() + 1);
		} else if (selectedExpiry === '1d') {
			expiryDate.setDate(now.getDate() + 1);
		} else if (selectedExpiry === '1w') {
			expiryDate.setDate(now.getDate() + 7);
		} else if (selectedExpiry === '1m') {
			expiryDate.setMonth(now.getMonth() + 1);
		} else if (selectedExpiry === '1y') {
			expiryDate.setFullYear(now.getFullYear() + 1);
		}

		paste.expiresAt = expiryDate.toISOString();
	}

	function handleSubmit() {
		calculateExpiry();
		dispatch('submit', paste);
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-6">
	<div>
		<label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
			Title
		</label>
		<input
			type="text"
			id="title"
			bind:value={paste.title}
			class="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
			placeholder="Paste title (optional)"
		/>
	</div>
	<div>
		<label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
			Content
		</label>
		<textarea
			id="content"
			bind:value={paste.content}
			rows="8"
			class="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
			placeholder="Paste your text here"
			required
			on:input={adjustHeight}
		></textarea>
	</div>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<div>
			<label for="syntax" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
				Syntax Highlighting
			</label>
			<select
				id="syntax"
				bind:value={paste.syntax}
				class="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
			>
				{#each syntaxOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="visibility" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
				Visibility
			</label>
			<select
				id="visibility"
				bind:value={paste.visibility}
				class="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
			>
				<option value="public">Public</option>
				<option value="unlisted">Unlisted</option>
				<option value="private">Private</option>
			</select>
		</div>

		<div>
			<label for="expiry" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
				Expiration
			</label>
			<select
				id="expiry"
				value={selectedExpiry}
				on:change={handleExpiryChange}
				class="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
			>
				{#each expiryOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
				Password (optional)
			</label>
			<input
				type="password"
				id="password"
				bind:value={paste.password}
				class="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
				placeholder="(Leave empty for no password)"
			/>
		</div>
	</div>
	<div class="flex justify-end space-x-4">
		<!-- Reset Button -->
		<button
			type="button"
			on:click={() =>
				(paste = {
					title: '',
					content: '',
					syntax: 'plaintext',
					visibility: 'public',
					expiresAt: '1h',
					password: null
				})}
			class="w-full rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
			disabled={loading}
		>
			Reset
		</button>

		<!-- Submit Button -->
		<button
			type="submit"
			class="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
			disabled={loading}
		>
			{loading ? 'Creating...' : 'Create Paste'}
		</button>
	</div>
</form>
