<script lang="ts">
	import { onMount } from 'svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import WeatherCard from '$lib/components/WeatherCard.svelte';
	import ForecastList from '$lib/components/ForecastList.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import TemperatureChart from '$lib/components/TemperatureChart.svelte';
	import DarkModeToggle from '$lib/components/DarkModeToggle.svelte';
	import { currentWeather, forecastData, isLoading, errorMessage, currentCity } from '$lib/stores/weatherStore';
	import { darkMode } from '$lib/stores/uiStore';
	import type { WeatherData, ForecastData } from '$lib/types/weather';

	let weather = $derived($currentWeather);
	let forecast = $derived($forecastData);
	let loading = $derived($isLoading);
	let error = $derived($errorMessage);
	let isDarkMode = $derived($darkMode);

	// Funktion zum Abrufen von Wetterdaten
	async function fetchWeather(city: string) {
		isLoading.set(true);
		errorMessage.set(null);

		try {
			const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Fehler beim Abrufen der Wetterdaten');
			}

			currentWeather.set(data as WeatherData);
			currentCity.set(city);
			await fetchForecast(city);
		} catch (err) {
			errorMessage.set(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
			currentWeather.set(null);
			forecastData.set(null);
		} finally {
			isLoading.set(false);
		}
	}

	// Funktion zum Abrufen der Vorhersage
	async function fetchForecast(city: string) {
		try {
			const response = await fetch(`/api/forecast?city=${encodeURIComponent(city)}`);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Fehler beim Abrufen der Vorhersagedaten');
			}

			forecastData.set(data as ForecastData);
		} catch (err) {
			console.error('Forecast error:', err);
			// Fehler nicht überschreiben wenn Wetter erfolgreich geladen wurde
			if (!weather) {
				errorMessage.set(err instanceof Error ? err.message : 'Fehler beim Abrufen der Vorhersage');
			}
		}
	}

	// Funktion zum Abrufen von Wetterdaten via Koordinaten
	async function fetchWeatherByCoords(lat: number, lon: number) {
		isLoading.set(true);
		errorMessage.set(null);

		try {
			const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Fehler beim Abrufen der Wetterdaten');
			}

			currentWeather.set(data as WeatherData);
			currentCity.set(data.location);
			await fetchForecastByCoords(lat, lon);
		} catch (err) {
			errorMessage.set(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
			currentWeather.set(null);
			forecastData.set(null);
		} finally {
			isLoading.set(false);
		}
	}

	// Funktion zum Abrufen der Vorhersage via Koordinaten
	async function fetchForecastByCoords(lat: number, lon: number) {
		try {
			const response = await fetch(`/api/forecast?lat=${lat}&lon=${lon}`);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Fehler beim Abrufen der Vorhersagedaten');
			}

			forecastData.set(data as ForecastData);
		} catch (err) {
			console.error('Forecast error:', err);
		}
	}

	// Geolocation verwenden
	function useGeolocation() {
		if (!navigator.geolocation) {
			errorMessage.set('Geolocation wird von Ihrem Browser nicht unterstützt');
			return;
		}

		isLoading.set(true);
		errorMessage.set(null);

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				fetchWeatherByCoords(latitude, longitude);
			},
			(error) => {
				isLoading.set(false);
				switch (error.code) {
					case error.PERMISSION_DENIED:
						errorMessage.set('Standortzugriff wurde verweigert');
						break;
					case error.POSITION_UNAVAILABLE:
						errorMessage.set('Standortinformationen nicht verfügbar');
						break;
					case error.TIMEOUT:
						errorMessage.set('Standortabfrage hat zu lange gedauert');
						break;
					default:
						errorMessage.set('Ein unbekannter Fehler ist aufgetreten');
				}
			}
		);
	}

	// Fehler schließen
	function dismissError() {
		errorMessage.set(null);
	}

	// Wetter-basierte Hintergrundfarbe
	let backgroundClass = $derived.by(() => {
		if (!weather) return 'bg-default';

		const condition = weather.condition.toLowerCase();
		const isDark = isDarkMode;

		if (condition.includes('clear') || condition.includes('sun')) {
			return isDark ? 'bg-clear-dark' : 'bg-clear';
		}
		if (condition.includes('cloud')) {
			return isDark ? 'bg-cloudy-dark' : 'bg-cloudy';
		}
		if (condition.includes('rain') || condition.includes('drizzle')) {
			return isDark ? 'bg-rainy-dark' : 'bg-rainy';
		}
		if (condition.includes('snow')) {
			return isDark ? 'bg-snowy-dark' : 'bg-snowy';
		}
		if (condition.includes('thunder') || condition.includes('storm')) {
			return isDark ? 'bg-stormy-dark' : 'bg-stormy';
		}

		return isDark ? 'bg-default-dark' : 'bg-default';
	});

	// init mit Standardstadt laden
	onMount(() => {
		fetchWeather('Karlsruhe');
	});
</script>

<svelte:head>
	<title>Wetter App - Aktuelle Wettervorhersage</title>
	<meta name="description" content="Moderne Wetter-Webanwendung mit 5-Tage-Vorhersage" />
</svelte:head>

<div class="app {backgroundClass}">
	<DarkModeToggle />

	<main class="container">
		<header>
			<h1 class="app-title">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="40"
					height="40"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
				</svg>
				Wetter App
			</h1>
			<p class="app-subtitle">zeigt das Wetter an</p>
		</header>

		<SearchBar onSearch={fetchWeather} onLocationClick={useGeolocation} disabled={loading} />

		{#if error}
			<ErrorMessage message={error} onDismiss={dismissError} />
		{/if}

		{#if loading}
			<LoadingSpinner />
		{:else if weather}
			<div class="weather-content">
				<WeatherCard {weather} />

				{#if forecast && forecast.forecast.length > 0}
					<ForecastList forecast={forecast.forecast} />
					<TemperatureChart forecast={forecast.forecast} />
				{/if}
			</div>
		{/if}
	</main>

	<footer class="footer">
		<p>
			API by <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer"
				>OpenWeatherMap</a
			>
		</p>
		<p>© 2026</p>
	</footer>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			sans-serif;
	}

	.app {
		min-height: 100vh;
		transition: background 0.5s ease;
		color: white;
		position: relative;
	}

	/* Hintergrund-Farben basierend auf Wetter */
	.bg-default {
		background: linear-gradient(135deg, #1a2f8b 0%, #270946 100%);
	}

	.bg-default-dark {
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	}

	.bg-clear {
		background: linear-gradient(137deg, #4facfe 0%, #008389 100%);
	}

	.bg-clear-dark {
		background: linear-gradient(135deg, #0f2027 0%, #203a43 100%);
	}

	.bg-cloudy {
		background: linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%);
	}

	.bg-cloudy-dark {
		background: linear-gradient(135deg, #232526 0%, #414345 100%);
	}

	.bg-rainy {
		background: linear-gradient(135deg, #245053 0%, #66a6ff 100%);
	}

	.bg-rainy-dark {
		background: linear-gradient(135deg, #1c3643 0%, #273b47 100%);
	}

	.bg-snowy {
		background: linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%);
	}

	.bg-snowy-dark {
		background: linear-gradient(135deg, #304352 0%, #d7d2cc 100%);
	}

	.bg-stormy {
		background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%);
	}

	.bg-stormy-dark {
		background: linear-gradient(135deg, #000000 0%, #434343 100%);
	}

	.container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem 1rem;
		min-height: calc(100vh - 100px);
	}

	header {
		text-align: center;
		margin-bottom: 3rem;
		animation: fadeInDown 0.6s ease;
	}

	@keyframes fadeInDown {
		from {
			opacity: 0;
			transform: translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.app-title {
		font-size: 3rem;
		font-weight: 700;
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
	}

	.app-subtitle {
		font-size: 1.25rem;
		margin: 0.5rem 0 0;
		opacity: 0.9;
	}

	.weather-content {
		animation: fadeIn 0.8s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.footer {
		text-align: center;
		padding: 2rem 1rem;
		opacity: 0.8;
		font-size: 0.875rem;
	}

	.footer p {
		margin: 0.25rem 0;
	}

	.footer a {
		color: inherit;
		text-decoration: underline;
		transition: opacity 0.3s ease;
	}

	.footer a:hover {
		opacity: 0.7;
	}

	@media (max-width: 768px) {
		.container {
			padding: 1.5rem 0.75rem;
		}

		.app-title {
			font-size: 2rem;
		}

		.app-title svg {
			width: 32px;
			height: 32px;
		}

		.app-subtitle {
			font-size: 1rem;
		}
	}
</style>
