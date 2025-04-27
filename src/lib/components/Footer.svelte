<script>
	const year = new Date().getFullYear();
</script>

<footer class="bg-gray-800 text-white">
	<div class="container mx-auto px-3 py-2 sm:px-6 sm:py-4 md:px-10">
		<div class="flex flex-col items-center justify-between gap-2 md:flex-row">
			<div class="flex items-center">
				<span class="font-semibold">PasteIt</span>
				<span class="mx-2">•</span>
				<span>© {year}</span>
			</div>

			<!-- Essential links -->
			<div class="flex space-x-6">
				<a href="/" class="hover:text-blue-600 dark:hover:text-blue-400">Home</a>
				<a href="/pastes/explore" class="hover:text-blue-600 dark:hover:text-blue-400">Explore</a>
			</div>
		</div>
	</div>
</footer>
