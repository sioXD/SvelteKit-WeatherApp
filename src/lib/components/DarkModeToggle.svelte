<script lang="ts">
	import { darkMode } from '$lib/stores/uiStore';

	let isDark = $derived($darkMode);

	function toggle() {
		darkMode.toggle();
	}
</script>

<button class="dark-mode-toggle" onclick={toggle} title={isDark ? 'Light Mode' : 'Dark Mode'}>
	{#if isDark}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		>
			<circle cx="12" cy="12" r="5"></circle>
			<line x1="12" y1="1" x2="12" y2="3"></line>
			<line x1="12" y1="21" x2="12" y2="23"></line>
			<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
			<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
			<line x1="1" y1="12" x2="3" y2="12"></line>
			<line x1="21" y1="12" x2="23" y2="12"></line>
			<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
			<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
		</svg>
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		>
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
		</svg>
	{/if}
</button>

<style>
	.dark-mode-toggle {
		position: fixed;
		top: 1.5rem;
		right: 1.5rem;
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		width: 50px;
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s ease;
		color: inherit;
		z-index: 1000;
	}

	.dark-mode-toggle:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: scale(1.1) rotate(20deg);
	}

	.dark-mode-toggle:active {
		transform: scale(0.95) rotate(20deg);
	}

	@media (max-width: 640px) {
		.dark-mode-toggle {
			top: 1rem;
			right: 1rem;
			width: 45px;
			height: 45px;
		}
	}
</style>
