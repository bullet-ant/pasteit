<script lang="ts">
	import { api } from '$lib/api';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { setAuth } from '$lib/utils';
	import AuthForm from '$lib/components/AuthForm.svelte';
	import { onMount } from 'svelte';
	import { isAuthenticated } from '$lib/utils';

	let loading = false;
	let errorMessage = '';
	let redirectTo = '/';

	onMount(() => {
		// Check if the user is already logged in
		if ($isAuthenticated) {
			goto('/');
			return;
		}

		// Get redirect parameter if it exists
		const url = $page.url;
		if (url.searchParams.has('redirect')) {
			redirectTo = url.searchParams.get('redirect') || '/';
		}
	});

	async function handleSubmit(event: any) {
		const { username, email, password } = event.detail;
		loading = true;
		errorMessage = '';

		try {
			const response = await api.auth.register(username, email, password);
			setAuth(response.user, response.token);
			goto(redirectTo);
		} catch (error: any) {
			console.error('Registration error:', error);
			errorMessage = error.message || 'Failed to register. Please try again.';
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Register | PasteIt</title>
</svelte:head>

<div class="mx-auto max-w-md">
	<div class="mb-8 text-center">
		<h1 class="text-3xl font-bold">Create an Account</h1>
		<p class="mt-2 text-gray-600 dark:text-gray-400">Sign up to create your first paste!</p>
	</div>

	<div class="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
		<AuthForm isLogin={false} {loading} {errorMessage} on:submit={handleSubmit} />
	</div>
</div>
