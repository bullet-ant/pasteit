<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let isLogin = true;
	export let loading = false;
	export let errorMessage = '';

	let email = '';
	let password = '';
	let username = '';

	const dispatch = createEventDispatcher();

	function handleSubmit() {
		if (isLogin) {
			dispatch('submit', { email, password });
		} else {
			dispatch('submit', { username, email, password });
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-6">
	{#if errorMessage}
		<div class="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
			{errorMessage}
		</div>
	{/if}

	{#if !isLogin}
		<div>
			<label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
				Username
			</label>
			<input
				type="text"
				id="username"
				bind:value={username}
				required
				class="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
			/>
		</div>
	{/if}

	<div>
		<label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
			Email
		</label>
		<input
			type="email"
			id="email"
			bind:value={email}
			required
			class="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
		/>
	</div>

	<div>
		<label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
			Password
		</label>
		<input
			type="password"
			id="password"
			bind:value={password}
			required
			class="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
		/>
	</div>

	<div class="flex items-center justify-between">
		{#if isLogin}
			<div class="text-sm">
				<a
					href="/auth/register"
					class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
				>
					Need an account? Register
				</a>
			</div>
		{:else}
			<div class="text-sm">
				<a
					href="/auth/login"
					class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
				>
					Already have an account? Login
				</a>
			</div>
		{/if}
	</div>

	<div>
		<button
			type="submit"
			class="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			disabled={loading}
		>
			{loading ? 'Logging in...' : isLogin ? 'Login' : 'Sign Up'}
		</button>
	</div>
</form>
