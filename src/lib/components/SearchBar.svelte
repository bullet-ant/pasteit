<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let value = '';
	export let placeholder = 'Search pastes...';

	const dispatch = createEventDispatcher();

	function handleSubmit() {
		dispatch('search', value);
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="w-full">
	<div class="relative">
		<input
			type="text"
			bind:value
			{placeholder}
			class="w-full rounded-md border border-gray-300 p-3 pr-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
		/>
		<button
			type="submit"
			class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
		</button>
	</div>
</form>
