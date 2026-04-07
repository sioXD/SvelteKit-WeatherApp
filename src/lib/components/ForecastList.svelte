<script lang="ts">
	import type { ForecastDay } from '$lib/types/weather';

	interface Props {
		forecast: ForecastDay[];
	}

	let { forecast }: Props = $props();

	function getWeatherIcon(icon: string): string {
		return `https://openweathermap.org/img/wn/${icon}@2x.png`;
	}
</script>

<div class="forecast-container">
	<h3 class="forecast-title">5-Tage Vorhersage</h3>
	<div class="forecast-list">
		{#each forecast as day}
			<div class="forecast-card">
				<p class="day-name">{day.dayOfWeek}</p>
				<p class="day-date">{new Date(day.date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}</p>
				<img src={getWeatherIcon(day.icon)} alt={day.description} class="forecast-icon" />
				<p class="forecast-description">{day.description}</p>
				<div class="temperature-range">
					<span class="temp-max">{day.temperature.max}°</span>
					<span class="temp-divider">/</span>
					<span class="temp-min">{day.temperature.min}°</span>
				</div>
				<div class="forecast-details">
					<div class="detail">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
						</svg>
						<span>{day.humidity}%</span>
					</div>
					<div class="detail">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
						</svg>
						<span>{day.windSpeed} km/h</span>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.forecast-container {
		width: 100%;
		max-width: 1200px;
		margin: 2rem auto 0;
	}

	.forecast-title {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.forecast-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		gap: 1rem;
	}

	.forecast-card {
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(20px);
		border-radius: 20px;
		padding: 1.5rem 1rem;
		text-align: center;
		border: 1px solid rgba(255, 255, 255, 0.2);
		transition: all 0.3s ease;
	}

	.forecast-card:hover {
		transform: translateY(-4px);
		background: rgba(255, 255, 255, 0.2);
	}

	.day-name {
		font-size: 1.1rem;
		font-weight: 600;
		margin: 0 0 0.25rem;
	}

	.day-date {
		font-size: 0.875rem;
		opacity: 0.8;
		margin: 0 0 1rem;
	}

	.forecast-icon {
		width: 80px;
		height: 80px;
		margin: 0 auto;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
	}

	.forecast-description {
		font-size: 0.875rem;
		text-transform: capitalize;
		margin: 0.5rem 0;
		opacity: 0.9;
		min-height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.temperature-range {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-size: 1.5rem;
		font-weight: 600;
		margin: 1rem 0;
	}

	.temp-max {
		color: inherit;
	}

	.temp-min {
		opacity: 0.7;
	}

	.temp-divider {
		opacity: 0.5;
	}

	.forecast-details {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid rgba(255, 255, 255, 0.2);
	}

	.detail {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.875rem;
		opacity: 0.8;
	}

	.detail svg {
		flex-shrink: 0;
	}

	@media (max-width: 768px) {
		.forecast-list {
			grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		}

		.forecast-card {
			padding: 1rem 0.75rem;
		}

		.forecast-icon {
			width: 70px;
			height: 70px;
		}

		.temperature-range {
			font-size: 1.25rem;
		}
	}

	@media (max-width: 640px) {
		.forecast-list {
			grid-template-columns: 1fr;
			max-width: 300px;
			margin: 0 auto;
		}
	}
</style>
