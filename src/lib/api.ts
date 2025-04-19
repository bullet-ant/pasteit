import { browser } from '$app/environment';
import { get } from 'svelte/store';
import type {
	Paste,
	User,
	AuthResponse,
	PastesResponse,
	CreatePasteRequest,
	PaginationResult
} from './types';

const API_BASE = 'http://localhost:3000/api';

// Helper to get auth token from local storage
const getToken = (): string | null => {
	if (!browser) return null;
	return localStorage.getItem('token');
};

// Helper to add auth headers
const authHeaders = (): HeadersInit => {
	const token = getToken();
	return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generic fetch with error handling
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
	const response = await fetch(`${API_BASE}${endpoint}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...authHeaders(),
			...options.headers
		}
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || `API Error: ${response.status}`);
	}

	return response.json();
}

export const api = {
	// Health check
	health: () => fetchApi<{ status: string }>('/health'),

	// Paste endpoints
	pastes: {
		recent: () => fetchApi<PastesResponse>('/pastes/recent'),

		get: (shortId: string) => fetchApi<Paste>(`/pastes/${shortId}`),

		getRaw: (shortId: string) =>
			fetch(`${API_BASE}/pastes/${shortId}/raw`, {
				headers: authHeaders()
			}).then((res) => res.text()),

		create: (paste: Omit<Paste, 'shortId' | 'createdAt' | 'updatedAt'>) =>
			fetchApi<CreatePasteRequest>('/pastes', {
				method: 'POST',
				body: JSON.stringify(paste)
			}),

		update: (shortId: string, paste: Partial<Omit<Paste, 'shortId' | 'createdAt' | 'updatedAt'>>) =>
			fetchApi<Paste>(`/pastes/${shortId}`, {
				method: 'PUT',
				body: JSON.stringify(paste)
			}),

		delete: (shortId: string) =>
			fetchApi<void>(`/pastes/${shortId}`, {
				method: 'DELETE'
			}),

		search: (query: string) =>
			fetchApi<PastesResponse>(`/pastes/search?q=${encodeURIComponent(query)}`)
	},

	// Auth endpoints
	auth: {
		register: (username: string, email: string, password: string) =>
			fetchApi<AuthResponse>('/auth/register', {
				method: 'POST',
				body: JSON.stringify({ username, email, password })
			}),

		login: (email: string, password: string) =>
			fetchApi<AuthResponse>('/auth/login', {
				method: 'POST',
				body: JSON.stringify({ email, password })
			}),

		me: () => fetchApi<User>('/auth/me'),

		updateProfile: (data: Partial<User>) =>
			fetchApi<User>('/auth/me', {
				method: 'PUT',
				body: JSON.stringify(data)
			})
	},

	// User endpoints
	users: {
		getPastes: (userId: string) => fetchApi<PaginationResult<Paste>>(`/users/${userId}/pastes`),

		get: (userId: string) => fetchApi<User>(`/users/${userId}`),

		changePassword: (oldPassword: string, newPassword: string) =>
			fetchApi<void>('/auth/change-password', {
				method: 'POST',
				body: JSON.stringify({ oldPassword, newPassword })
			})
	}
};
