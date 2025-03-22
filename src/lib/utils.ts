import { writable, type Writable } from 'svelte/store';
import type { User } from './types';
import { jwtDecode } from 'jwt-decode';

// User store to handle authentication state
export const currentUser: Writable<User | null> = writable(null);
export const isAuthenticated: Writable<boolean> = writable(false);

// Initialize auth from localStorage (called in +layout.svelte)
export function initAuth(): void {
	if (typeof localStorage !== 'undefined') {
		const token = localStorage.getItem('token');
		const user = localStorage.getItem('user');

		if (token && user) {
			try {
				// Decode the token to check expiration
				const decoded: { exp: number } = jwtDecode(token);
				const currentTime = Math.floor(Date.now() / 1000);

				if (decoded.exp > currentTime) {
					currentUser.set(JSON.parse(user));
					isAuthenticated.set(true);
				} else {
					logout();
				}
			} catch (error) {
				console.error('Error parsing user data:', error);
				logout();
			}
		}
	}
}

// Set auth data after login/register
export function setAuth(user: User, token: string): void {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('token', token);
		localStorage.setItem('user', JSON.stringify(user));
		currentUser.set(user);
		isAuthenticated.set(true);
	}
}

// Clear auth data on logout
export function logout(): void {
	if (typeof localStorage !== 'undefined') {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		currentUser.set(null);
		isAuthenticated.set(false);
	}
}

// Format date for display
export function formatDate(dateString: string): string {
	return new Date(dateString)
		.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		})
		.trim();
}

// Get syntax highlighting language options
export function getSyntaxOptions(): { value: string; label: string }[] {
	return [{ value: 'plaintext', label: 'Plain Text' }];
}
