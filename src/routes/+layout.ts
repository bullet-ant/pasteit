import { redirect } from '@sveltejs/kit';

// This runs on both server and client
export const load = async ({ url }) => {
	// Only allow the root path to pass through normally
	if (url.pathname !== '/') {
		// Redirect all other paths to the root
		throw redirect(307, '/');
	}

	return {};
};

// Disable SSR for all pages to ensure the coming soon page is shown
export const ssr = false;

// Prevent pre-rendering
export const prerender = false;
