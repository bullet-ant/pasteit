// Common Types
export type Visibility = 'public' | 'private' | 'unlisted';

export type PasteSyntax =
	| 'plaintext'
	| 'javascript'
	| 'html'
	| 'css'
	| 'json'
	| 'python'
	| 'java'
	| 'csharp'
	| 'php';

export type ExpirationOption = 'never' | 'burn' | '10min' | '1hour' | '1day' | '1week' | '1month';

// User Related Types
export interface User {
	_id: string;
	username: string;
	email: string;
	createdAt: string;
}
export interface AuthResponse {
	message: string;
	user: User;
	token: string;
}

export interface RegisterRequest {
	username: string;
	email: string;
	password: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface UpdateProfileRequest {
	username?: string;
	email?: string;
}

export interface ChangePasswordRequest {
	currentPassword: string;
	newPassword: string;
}

export interface BaseResponse {
	message: string;
}

export interface SuccessResponse extends BaseResponse {
	success: boolean;
}

// Paste Related Types
export interface Paste {
	shortId: string;
	title: string;
	content: string;
	syntax: PasteSyntax;
	visibility: Visibility;
	expiresAt: string;
	userId: string | null;
	isProtected: boolean;
	password?: string | null;
	tags: string[];
	createdAt: string;
	updatedAt: string;
	views: number;
}

export interface PasteResponse extends Omit<Paste, 'password'> {
	isProtected: boolean;
}

export interface CreatePasteRequest {
	title: string;
	content: string;
	syntax: PasteSyntax;
	visibility: Visibility;
	expiresAt?: string | null;
	password?: string | null;
	tags?: string[];
}

export interface CreatePasteResponse {
	message: string;
	paste: PasteResponse;
}

export interface UnlockPasteRequest {
	password: string;
}

export interface UpdatePasteRequest {
	title?: string;
	content?: string;
	syntax?: PasteSyntax;
	visibility?: Visibility;
	expiresAt?: string | null;
	password?: string | null;
	tags?: string[];
}

export interface PastesResponse {
	pastes: PasteResponse[];
	pagination: Pagination;
}

export interface PaginationResult<Paste> {
	pastes: Paste[];
	pagination: Pagination;
}
export interface Pagination {
	total: number;
	page: number;
	limit: number;
	pages: number;
}

export interface SearchPastesParams {
	query?: string;
	page?: number;
	limit?: number;
	syntax?: PasteSyntax | null;
	tags?: string[];
}

export interface GetUserPastesParams {
	page?: number;
	limit?: number;
	visibility?: Visibility;
}

// Error Responses
export interface ErrorResponse {
	message: string;
	error?: string;
}

// Health Check Response
export interface HealthResponse {
	status: string;
	message: string;
}
