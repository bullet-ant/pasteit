<script lang="ts">
	import { formatDate } from '$lib/utils';
	import type { Paste } from '$lib/types';

	export let paste: Paste;

	let linkCopied = false;

	function shareLink() {
		const url = `${window.location.origin}/pastes/${paste.shortId}`;
		navigator.clipboard.writeText(url);
		linkCopied = true;

		// Reset after 2 seconds
		setTimeout(() => {
			linkCopied = false;
		}, 2000);
	}
</script>

<div
	class="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
>
	<div class="flex-1 p-4">
		<div class="flex items-start justify-between">
			<h3 class="truncate text-lg font-medium text-gray-900 dark:text-white">
				{paste.title || 'Untitled Paste'}
			</h3>
			<div class="flex space-x-2">
				{#if paste.isProtected}
					<span
						class="bg-grey-100 dark:bg-grey-900 inline-flex items-center rounded px-2 py-1 text-xs font-medium text-green-800 dark:text-green-200"
					>
						<svg
							fill="white"
							width="20px"
							height="20px"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							><path
								d="M17,9V7A5,5,0,0,0,7,7V9a3,3,0,0,0-3,3v7a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V12A3,3,0,0,0,17,9ZM9,7a3,3,0,0,1,6,0V9H9Zm9,12a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V12a1,1,0,0,1,1-1H17a1,1,0,0,1,1,1Z"
							/></svg
						>
					</span>
				{/if}
				<span
					class="inline-flex items-center rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
				>
					{paste.syntax}
				</span>

				{#if paste.visibility === 'private'}
					<span
						class="inline-flex items-center rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200"
					>
						private
					</span>
				{:else if paste.visibility === 'unlisted'}
					<span
						class="inline-flex items-center rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
					>
						unlisted
					</span>
				{/if}
			</div>
		</div>
		<div class="min-h-[80px]">
			{#if !paste.isProtected}
				<!-- For non-protected pastes: show preview -->
				<p class="mt-2 line-clamp-3 font-mono text-sm text-gray-600 dark:text-gray-300">
					{paste.content}
				</p>
			{:else}
				<!-- For protected pastes: show placeholder -->
				<div class="mt-2 flex items-center justify-center rounded bg-gray-100 p-5 dark:bg-gray-900">
					<span class="flex items-center text-sm text-gray-500 dark:text-gray-400">
						<svg
							class="mr-2 h-4 w-4"
							fill="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M17,9V7A5,5,0,0,0,7,7V9a3,3,0,0,0-3,3v7a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V12A3,3,0,0,0,17,9ZM9,7a3,3,0,0,1,6,0V9H9Zm9,12a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V12a1,1,0,0,1,1-1H17a1,1,0,0,1,1,1Z"
							/>
						</svg>
						Password protected content
					</span>
				</div>
			{/if}
		</div>

		<div class="mt-4 flex text-sm text-gray-500 dark:text-gray-400">
			<div class="flex w-full justify-between">
				<p>Created: {formatDate(paste.createdAt)}</p>
				<p>Expires: {formatDate(paste.expiresAt)}</p>
			</div>
		</div>
	</div>

	<div class="flex justify-between bg-gray-50 px-4 py-3 dark:bg-gray-700">
		<a href={`/pastes/${paste.shortId}`} class="text-blue-600 hover:underline dark:text-blue-400">
			View
		</a>
		<div class="flex space-x-3">
			{#if paste.userId}
				<a href={`/user/${paste.userId}`} class="text-gray-600 hover:underline dark:text-gray-300">
					Author
				</a>
			{/if}
			<button
				on:click={shareLink}
				class="flex items-center {linkCopied
					? 'text-green-600 dark:text-green-400'
					: 'text-blue-600 dark:text-blue-400'} hover:underline"
				title="Copy link to clipboard"
			>
				{#if linkCopied}
					<span class="flex items-center">
						<svg
							class="mr-1 h-4 w-4"
							viewBox="0 0 20 20"
							fill="currentColor"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
						Copied!
					</span>
				{:else}
					<span>Share</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="ml-1 h-4 w-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="18" cy="5" r="3"></circle>
						<circle cx="6" cy="12" r="3"></circle>
						<circle cx="18" cy="19" r="3"></circle>
						<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
						<line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
					</svg>
				{/if}
			</button>
			<!-- <a
				href={`/pastes/${paste.shortId}/raw`}
				class="text-gray-600 hover:underline dark:text-gray-300"
				target="_blank"
			>
				Raw
			</a> -->
		</div>
	</div>
</div>
