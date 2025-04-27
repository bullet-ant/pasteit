<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { initAuth } from '$lib/utils';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	onMount(() => {
		initAuth();
	});
</script>

<div
	class="flex min-h-screen flex-col bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100"
>
	<Header />

	<main class="container mx-auto flex-grow px-3 py-4 sm:px-6 md:px-10 md:py-8">
		<slot />
	</main>

	<Footer />
</div>
