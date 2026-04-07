<script lang="ts">
	import { favorites } from '$lib/stores/uiStore';

	interface Props {
		onSearch: (city: string) => void;
		onLocationClick?: () => void;
		disabled?: boolean;
	}

	let { onSearch, onLocationClick, disabled = false }: Props = $props();

	let searchValue = $state('');
	let favoritesList = $derived($favorites);

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (searchValue.trim()) {
			onSearch(searchValue.trim());
		}
	}

	function handleLocationClick() {
		if (onLocationClick) {
			onLocationClick();
		}
	}

	function searchFavorite(city: string) {
		searchValue = city;
		onSearch(city);
	}
</script>

<div class="search-container">
	<form onsubmit={handleSubmit} class="search-form">
		<input
			type="text"
			bind:value={searchValue}
			placeholder="Stadt suchen... (z.B. Berlin, London, Tokyo)"
			class="search-input"
			disabled={disabled}
		/>
		<button type="submit" class="search-button" aria-label="searchButton" disabled={disabled || !searchValue.trim()}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<circle cx="11" cy="11" r="8"></circle>
				<path d="m21 21-4.35-4.35"></path>
			</svg>
		</button>
		{#if onLocationClick}
			<button
				type="button"
				class="location-button"
				onclick={handleLocationClick}
				disabled={disabled}
				title="Aktuellen Standort verwenden"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
					<circle cx="12" cy="10" r="3"></circle>
				</svg>
			</button>
		{/if}
	</form>

	{#if favoritesList.length > 0}
		<div class="favorites">
			<p class="favorites-label">Favoriten:</p>
			<div class="favorites-list">
				{#each favoritesList as city}
					<button class="favorite-chip" onclick={() => searchFavorite(city)}>
						{city}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.search-container {
		width: 100%;
		max-width: 600px;
		margin: 0 auto;
	}

	.search-form {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.search-input {
		flex: 1;
		padding: 0.875rem 1rem;
		border: 2px solid rgba(255, 255, 255, 0.2);
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		color: inherit;
		font-size: 1rem;
		transition: all 0.3s ease;
	}

	.search-input::placeholder {
		color: rgba(255, 255, 255, 0.6);
	}

	.search-input:focus {
		outline: none;
		border-color: rgba(255, 255, 255, 0.4);
		background: rgba(255, 255, 255, 0.15);
	}

	.search-input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.search-button,
	.location-button {
		padding: 0.875rem 1rem;
		border: none;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(10px);
		color: inherit;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.search-button:hover:not(:disabled),
	.location-button:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.3);
		transform: translateY(-2px);
	}

	.search-button:active:not(:disabled),
	.location-button:active:not(:disabled) {
		transform: translateY(0);
	}

	.search-button:disabled,
	.location-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.favorites {
		margin-top: 1rem;
	}

	.favorites-label {
		font-size: 0.875rem;
		margin-bottom: 0.5rem;
		opacity: 0.8;
	}

	.favorites-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.favorite-chip {
		padding: 0.5rem 1rem;
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 20px;
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(10px);
		color: inherit;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.favorite-chip:hover {
		background: rgba(255, 255, 255, 0.25);
		transform: translateY(-2px);
	}

	@media (max-width: 640px) {
		.search-input::placeholder {
			font-size: 0.875rem;
		}
	}
</style>
