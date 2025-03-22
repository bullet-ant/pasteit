<script>
	import { isAuthenticated } from '$lib/utils'; // Import the authentication store
	const year = new Date().getFullYear();
</script>

<footer class="mt-auto bg-gray-800 py-8 text-white">
	<div class="container mx-auto px-4">
		<div class="flex flex-col items-center justify-between md:flex-row">
			<!-- Left side: Brand and description -->
			<div class="mb-4 md:mb-0">
				<div class="text-xl font-bold">PasteIt</div>
				<div class="text-sm text-gray-400">Share code snippets easily</div>
			</div>

			<!-- Right side: Navigation and Account -->
			<div class="hidden flex-col md:flex md:flex-row md:justify-end md:space-x-8">
				<div class="mb-4 md:mb-0">
					<h3 class="mb-2 font-semibold">Navigation</h3>
					<ul class="space-y-1 text-gray-400">
						<li><a href="/" class="hover:text-white">Home</a></li>
						<li><a href="/pastes" class="hover:text-white">Explore</a></li>
						<li><a href="/search" class="hover:text-white">Search</a></li>
					</ul>
				</div>

				<!-- Conditionally render Account section -->
				{#if $isAuthenticated}
					<div>
						<h3 class="mb-2 font-semibold">Account</h3>
						<ul class="space-y-1 text-gray-400">
							<li><a href="/profile" class="hover:text-white">My Profile</a></li>
							<li><a href="/my-pastes" class="hover:text-white">My Pastes</a></li>
						</ul>
					</div>
				{:else}
					<div>
						<h3 class="mb-2 font-semibold">Account</h3>
						<ul class="space-y-1 text-gray-400">
							<li><a href="/auth/login" class="hover:text-white">Login</a></li>
							<li><a href="/auth/register" class="hover:text-white">Register</a></li>
						</ul>
					</div>
				{/if}
			</div>
		</div>

		<!-- Horizontal rule section -->
		<div class="mt-6 hidden border-t border-gray-700 md:block"></div>

		<!-- Copyright text section -->
		<div class="mt-6 text-center text-gray-400">
			<p>© {year} PasteIt. All rights reserved.</p>
		</div>
	</div>
</footer>
