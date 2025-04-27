<script lang="ts">
	import { page } from '$app/stores';
	import { currentUser, isAuthenticated, logout } from '$lib/utils';
	import { onMount } from 'svelte';
	import { api } from '$lib/api';

	let showDropdown = false;

	onMount(async () => {
		if ($isAuthenticated) {
			try {
				const user = await api.auth.me();
				$currentUser = user;
			} catch (e) {
				logout();
			}
		}
	});

	function handleLogout() {
		logout();
		window.location.href = '/';
	}

	function closeDropdown() {
		showDropdown = false;
	}
</script>

<header class="bg-gray-800 text-white shadow-md">
	<div class="container mx-auto px-10 py-4">
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-6">
				<a href="/" class="text-xl font-bold">PasteIt</a>
				<nav class="hidden space-x-4 md:flex">
					<a
						href="/pastes/explore"
						class="hover:text-blue-300 {$page.url.pathname.includes('/pastes/explore')
							? 'text-blue-300'
							: ''}"
					>
						Explore
					</a>
					{#if $isAuthenticated && $currentUser}
						<a
							href={`/user/${$currentUser._id}`}
							class="hover:text-blue-300 {$page.url.pathname === '/pastes/me'
								? 'text-blue-300'
								: ''}"
						>
							My Pastes
						</a>
						<a
							href="/pastes/new"
							class="hover:text-blue-300 {$page.url.pathname === '/pastes/new'
								? 'text-blue-300'
								: ''}"
						>
							New Paste
						</a>
					{/if}
				</nav>
			</div>

			<div class="flex items-center space-x-2">
				{#if $isAuthenticated && $currentUser}
					<div class="relative">
						<button
							on:click={() => (showDropdown = !showDropdown)}
							class="flex items-center space-x-1 rounded p-2 hover:bg-gray-700"
						>
							<span>{$currentUser.username}</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>

						{#if showDropdown}
							<!-- Backdrop -->
							<div class="fixed inset-0 z-0 bg-black opacity-10" on:click={closeDropdown}></div>

							<!-- Dropdown -->
							<div class="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg">
								<a
									href="/user/profile"
									class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								>
									My Profile
								</a>
								<a
									href={`/user/${$currentUser._id}`}
									class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								>
									My Pastes
								</a>
								<button
									on:click={handleLogout}
									class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
								>
									Logout
								</button>
							</div>
						{/if}
					</div>
				{:else}
					<a href="/auth/login" class="rounded px-3 py-1 hover:bg-gray-700">Login</a>
					<a href="/auth/register" class="rounded bg-blue-600 px-3 py-1 hover:bg-blue-700"
						>Sign Up</a
					>
				{/if}
			</div>
		</div>
	</div>
</header>
