<script lang="ts">
	import type { WeatherData } from '$lib/types/weather';
	import { favorites } from '$lib/stores/uiStore';

	interface Props {
		weather: WeatherData;
	}

	let { weather }: Props = $props();
	let favoritesList = $derived($favorites);
	let isFavorite = $derived(favoritesList.includes(weather.location));

	function toggleFavorite() {
		favorites.toggle(weather.location);
	}

	function getWeatherIcon(icon: string): string {
		return `https://openweathermap.org/img/wn/${icon}@2x.png`;
	}

	function formatDate(timestamp: number): string {
		return new Date(timestamp * 1000).toLocaleDateString('de-DE', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div class="weather-card">
	<div class="header">
		<div class="location-info">
			<h2 class="city">{weather.location}</h2>
			<p class="country">{weather.country}</p>
		</div>
		<button
			class="favorite-button"
			onclick={toggleFavorite}
			title={isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill={isFavorite ? 'currentColor' : 'none'}
				stroke="currentColor"
				stroke-width="2"
			>
				<path
					d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
				></path>
			</svg>
		</button>
	</div>

	<div class="main-weather">
		<img src={getWeatherIcon(weather.icon)} alt={weather.description} class="weather-icon" />
		<div class="temperature-section">
			<p class="temperature">{weather.temperature}°</p>
			<p class="feels-like">Gefühlt {weather.feelsLike}°</p>
		</div>
	</div>

	<p class="description">{weather.description}</p>

	<div class="details">
		<div class="detail-item">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
			</svg>
			<span>{weather.humidity}% Luftfeuchtigkeit</span>
		</div>
		<div class="detail-item">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
			</svg>
			<span>{weather.windSpeed} km/h Wind</span>
		</div>
	</div>

	<p class="timestamp">{formatDate(weather.timestamp)}</p>
</div>

<style>
	.weather-card {
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(20px);
		border-radius: 24px;
		padding: 2rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		transition: transform 0.3s ease;
		width: 100%;
		max-width: 500px;
		margin: 0 auto;
	}

	.weather-card:hover {
		transform: translateY(-4px);
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1.5rem;
	}

	.location-info {
		flex: 1;
	}

	.city {
		font-size: 2rem;
		font-weight: 700;
		margin: 0;
		line-height: 1.2;
	}

	.country {
		font-size: 1rem;
		opacity: 0.8;
		margin: 0.25rem 0 0;
	}

	.favorite-button {
		background: rgba(255, 255, 255, 0.2);
		border: none;
		border-radius: 12px;
		padding: 0.5rem;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		color: inherit;
	}

	.favorite-button:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: scale(1.1);
	}

	.main-weather {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin: 2rem 0;
	}

	.weather-icon {
		width: 120px;
		height: 120px;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
	}

	.temperature-section {
		text-align: center;
	}

	.temperature {
		font-size: 4.5rem;
		font-weight: 700;
		margin: 0;
		line-height: 1;
	}

	.feels-like {
		font-size: 1rem;
		opacity: 0.8;
		margin: 0.5rem 0 0;
	}

	.description {
		text-align: center;
		font-size: 1.25rem;
		text-transform: capitalize;
		margin: 1rem 0 2rem;
		font-weight: 500;
	}

	.details {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin: 2rem 0;
	}

	.detail-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: rgba(255, 255, 255, 0.1);
		padding: 1rem;
		border-radius: 12px;
	}

	.detail-item svg {
		flex-shrink: 0;
		opacity: 0.8;
	}

	.detail-item span {
		font-size: 0.95rem;
	}

	.timestamp {
		text-align: center;
		font-size: 0.875rem;
		opacity: 0.7;
		margin: 1rem 0 0;
	}

	@media (max-width: 640px) {
		.weather-card {
			padding: 1.5rem;
		}

		.city {
			font-size: 1.75rem;
		}

		.temperature {
			font-size: 3.5rem;
		}

		.weather-icon {
			width: 100px;
			height: 100px;
		}

		.details {
			grid-template-columns: 1fr;
		}
	}
</style>
