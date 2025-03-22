<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { api } from '$lib/api';
	import { currentUser, isAuthenticated, setAuth } from '$lib/utils';

	let loading = false;
	let saving = false;
	let successMessage = '';
	let errorMessage = '';

	let username = '';
	let email = '';
	let currentPassword = '';
	let newPassword = '';
	let confirmPassword = '';

	onMount(() => {
		// Redirect if not authenticated
		if (!$isAuthenticated) {
			goto('/auth/login?redirect=/user/profile');
			return;
		}

		// Load user data
		if ($currentUser) {
			username = $currentUser.username;
			email = $currentUser.email;
		}
	});

	async function updateProfile() {
		saving = true;
		errorMessage = '';
		successMessage = '';

		try {
			// Only update fields that are filled in
			const updateData: any = {};
			if (username !== $currentUser?.username) updateData.username = username;
			if (email !== $currentUser?.email) updateData.email = email;

			if (Object.keys(updateData).length === 0) {
				successMessage = 'No changes to save';
				saving = false;
				return;
			}

			const response = await api.users.updateProfile(updateData);

			// Update the current user with new data
			setAuth({ ...$currentUser, ...updateData }, response.token);

			successMessage = 'Profile updated successfully';
		} catch (error: any) {
			console.error('Profile update error:', error);
			errorMessage = error.message || 'Failed to update profile';
		} finally {
			saving = false;
		}
	}

	async function updatePassword() {
		saving = true;
		errorMessage = '';
		successMessage = '';

		if (!currentPassword) {
			errorMessage = 'Current password is required';
			saving = false;
			return;
		}

		if (newPassword !== confirmPassword) {
			errorMessage = 'New passwords do not match';
			saving = false;
			return;
		}

		try {
			await api.users.changePassword(currentPassword, newPassword);

			// Clear password fields
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';

			successMessage = 'Password changed successfully';
		} catch (error: any) {
			console.error('Password update error:', error);
			errorMessage = error.message || 'Failed to change password';
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head>
	<title>My Profile | PasteIt</title>
</svelte:head>

<div class="mx-auto max-w-2xl">
	<h1 class="mb-6 text-3xl font-bold">My Profile</h1>

	{#if errorMessage}
		<div
			class="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700 dark:border-red-700 dark:bg-red-900 dark:text-red-300"
		>
			{errorMessage}
		</div>
	{/if}

	{#if successMessage}
		<div
			class="mb-4 rounded border border-green-400 bg-green-100 p-3 text-green-700 dark:border-green-700 dark:bg-green-900 dark:text-green-300"
		>
			{successMessage}
		</div>
	{/if}

	<div class="space-y-8">
		<!-- Profile Information -->
		<div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
			<h2 class="mb-4 text-xl font-semibold">Profile Information</h2>

			<div class="mb-4">
				<label for="username" class="mb-1 block text-sm font-medium">Username</label>
				<input
					type="text"
					id="username"
					bind:value={username}
					class="w-full rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-700"
				/>
			</div>

			<div class="mb-6">
				<label for="email" class="mb-1 block text-sm font-medium">Email</label>
				<input
					type="email"
					id="email"
					bind:value={email}
					class="w-full rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-700"
				/>
			</div>

			<button
				on:click={updateProfile}
				disabled={saving}
				class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
			>
				{saving ? 'Saving...' : 'Update Profile'}
			</button>
		</div>

		<!-- Change Password -->
		<div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
			<h2 class="mb-4 text-xl font-semibold">Change Password</h2>

			<div class="mb-4">
				<label for="current-password" class="mb-1 block text-sm font-medium">Current Password</label
				>
				<input
					type="password"
					id="current-password"
					bind:value={currentPassword}
					class="w-full rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-700"
				/>
			</div>

			<div class="mb-4">
				<label for="new-password" class="mb-1 block text-sm font-medium">New Password</label>
				<input
					type="password"
					id="new-password"
					bind:value={newPassword}
					class="w-full rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-700"
				/>
			</div>

			<div class="mb-6">
				<label for="confirm-password" class="mb-1 block text-sm font-medium">Confirm Password</label
				>
				<input
					type="password"
					id="confirm-password"
					bind:value={confirmPassword}
					class="w-full rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-700"
				/>
			</div>

			<button
				on:click={updatePassword}
				disabled={saving}
				class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
			>
				{saving ? 'Changing...' : 'Change Password'}
			</button>
		</div>

		<!-- Account Settings/Stats -->
		<div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
			<h2 class="mb-4 text-xl font-semibold">Account</h2>

			<div class="mb-4">
				<p class="text-gray-600 dark:text-gray-400">
					Member since: {$currentUser?.createdAt
						? new Date($currentUser.createdAt).toLocaleDateString()
						: 'N/A'}
				</p>
			</div>

			<div class="mt-6">
				<a href="/user/{$currentUser?.id}" class="text-blue-600 hover:underline dark:text-blue-400">
					View my public profile
				</a>
			</div>
		</div>
	</div>
</div>
