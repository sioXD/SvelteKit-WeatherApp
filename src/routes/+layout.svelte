<script lang="ts">
	import { page } from '$app/stores';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<nav class="top-nav" aria-label="navBar">
	<a href="/" class="nav-link" class:active={$page.url.pathname === '/'}>Home</a>
	<a href="/map" class="nav-link" class:active={$page.url.pathname.startsWith('/map')}>Map</a>
</nav>


<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style>
	:global(*) {
		box-sizing: border-box;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		overflow-x: hidden;
	}

	.top-nav {
		position: fixed;
		top: 2.5rem;
		left: 10%;
		transform: translateX(-50%);
		display: flex;
		gap: 0.4rem;
		padding: 0.4rem;
		z-index: 2000;
		border-radius: 999px;
		background: rgba(13, 19, 44, 0.55);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		box-shadow: 0 8px 30px rgba(5, 10, 30, 0.35);
	}

	.nav-link {
		color: #e6ecff;
		text-decoration: none;
		font-weight: 700;
		letter-spacing: 0.01em;
		padding: 0.5rem 1rem;
		border-radius: 999px;
		transition: background 0.25s ease, color 0.25s ease, transform 0.2s ease;
	}

	.nav-link:hover {
		background: rgba(255, 255, 255, 0.15);
		color: #ffffff;
		transform: translateY(-1px);
	}

	.nav-link.active {
		background: linear-gradient(135deg, rgba(79, 172, 254, 0.85) 0%, rgba(0, 131, 137, 0.85) 100%);
		color: #ffffff;
		box-shadow: 0 6px 16px rgba(22, 95, 138, 0.45);
	}

	@media (max-width: 768px) {
		.top-nav {
			top: 0.6rem;
			padding: 0.3rem;
		}

		.nav-link {
			padding: 0.45rem 0.85rem;
			font-size: 0.92rem;
		}
	}
</style>
