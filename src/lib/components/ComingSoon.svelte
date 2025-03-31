<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	// Target date: April 15, 2025
	const targetDate = new Date('2025-04-15T00:00:00');

	// Time units in milliseconds
	const SECOND = 1000;
	const MINUTE = SECOND * 60;
	const HOUR = MINUTE * 60;
	const DAY = HOUR * 24;

	// State for time remaining
	let days = 0;
	let hours = 0;
	let minutes = 0;
	let seconds = 0;
	let email = '';
	let isSubmitting = false;
	let isSubscribed = false;

	let countdownInterval: ReturnType<typeof setInterval>;

	function updateCountdown() {
		const now = new Date();
		const timeRemaining = targetDate.getTime() - now.getTime();

		if (timeRemaining <= 0) {
			// Target date reached
			days = hours = minutes = seconds = 0;
			clearInterval(countdownInterval);
			return;
		}

		// Calculate time units
		days = Math.floor(timeRemaining / DAY);
		hours = Math.floor((timeRemaining % DAY) / HOUR);
		minutes = Math.floor((timeRemaining % HOUR) / MINUTE);
		seconds = Math.floor((timeRemaining % MINUTE) / SECOND);
	}

	onMount(() => {
		// Initial calculation
		updateCountdown();

		// Update every second
		countdownInterval = setInterval(updateCountdown, 1000);
	});

	onDestroy(() => {
		// Clean up interval when component is destroyed
		if (countdownInterval) clearInterval(countdownInterval);
	});

	// Handle form submission for email notifications
	function handleSubscribe() {
		isSubmitting = true;

		// Simulate API call with timeout
		setTimeout(() => {
			isSubmitting = false;
			isSubscribed = true;
			email = '';
		}, 1000);

		// In a real implementation, you would call your API here
		// const response = await fetch('/api/subscribe', {
		//   method: 'POST',
		//   body: JSON.stringify({ email }),
		//   headers: { 'Content-Type': 'application/json' }
		// });
	}
</script>

<div class="w-full rounded-lg bg-white p-8 text-center shadow-md dark:bg-gray-800">
	<div class="mb-8">
		<h1 class="mb-2 text-4xl font-bold text-gray-900 dark:text-white">PasteIt</h1>
		<h2 class="mb-6 text-2xl font-bold text-blue-600 dark:text-blue-400">Coming Soon</h2>
		<p class="text-lg text-gray-600 dark:text-gray-300">
			We're working hard to bring you our new pastebin service.
			<br />Launching on April 15, 2025
		</p>
	</div>

	<div class="mb-8 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
		<div class="flex flex-col">
			<div class="mb-2 rounded-lg bg-blue-600 p-3 text-3xl font-bold text-white sm:p-4 sm:text-4xl">
				{days}
			</div>
			<span class="text-sm text-gray-600 dark:text-gray-400">Days</span>
		</div>

		<div class="flex flex-col">
			<div class="mb-2 rounded-lg bg-blue-600 p-3 text-3xl font-bold text-white sm:p-4 sm:text-4xl">
				{hours}
			</div>
			<span class="text-sm text-gray-600 dark:text-gray-400">Hours</span>
		</div>

		<div class="flex flex-col">
			<div class="mb-2 rounded-lg bg-blue-600 p-3 text-3xl font-bold text-white sm:p-4 sm:text-4xl">
				{minutes}
			</div>
			<span class="text-sm text-gray-600 dark:text-gray-400">Minutes</span>
		</div>

		<div class="flex flex-col">
			<div class="mb-2 rounded-lg bg-blue-600 p-3 text-3xl font-bold text-white sm:p-4 sm:text-4xl">
				{seconds}
			</div>
			<span class="text-sm text-gray-600 dark:text-gray-400">Seconds</span>
		</div>
	</div>

	<div class="mt-8">
		{#if isSubscribed}
			<div class="rounded-md bg-green-100 p-4 text-green-700 dark:bg-green-900 dark:text-green-200">
				Thanks! We'll notify you when we launch.
			</div>
		{:else}
			<form
				on:submit|preventDefault={handleSubscribe}
				class="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
			>
				<input
					type="email"
					bind:value={email}
					placeholder="Enter your email"
					required
					class="w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
				/>
				<button
					type="submit"
					disabled={isSubmitting}
					class="rounded-md bg-blue-600 px-6 py-3 text-white shadow-md hover:bg-blue-700 disabled:opacity-50"
				>
					{isSubmitting ? 'Submitting...' : 'Get Notified'}
				</button>
			</form>
		{/if}
	</div>

	<div class="mt-8 text-sm text-gray-500 dark:text-gray-400">
		<p>© {new Date().getFullYear()} PasteIt. All rights reserved.</p>
	</div>
</div>
