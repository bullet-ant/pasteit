<script>
	const year = new Date().getFullYear();
</script>

<footer
	class="mt-auto border-t border-gray-200 py-6 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400"
>
	<div class="container mx-auto px-10">
		<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
			<!-- Logo and copyright -->
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
