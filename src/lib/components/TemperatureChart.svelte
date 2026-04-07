<script lang="ts">
	import { onMount } from 'svelte';
	import type { ForecastDay } from '$lib/types/weather';
	import {
		Chart,
		LineController,
		LineElement,
		PointElement,
		LinearScale,
		CategoryScale,
		Title,
		Tooltip,
		Filler
	} from 'chart.js';

	interface Props {
		forecast: ForecastDay[];
	}

	let { forecast }: Props = $props();
	let canvasElement: HTMLCanvasElement;
	let chart: Chart | null = null;

	onMount(() => {
		// Registriere Chart.js Komponenten
		Chart.register(
			LineController,
			LineElement,
			PointElement,
			LinearScale,
			CategoryScale,
			Title,
			Tooltip,
			Filler
		);

		// Erstelle Diagramm
		const ctx = canvasElement.getContext('2d');
		if (!ctx) return;

		const labels = forecast.map((day) => day.dayOfWeek);
		const maxTemps = forecast.map((day) => day.temperature.max);
		const minTemps = forecast.map((day) => day.temperature.min);

		chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels,
				datasets: [
					{
						label: 'Max Temperatur',
						data: maxTemps,
						borderColor: 'rgba(255, 99, 132, 1)',
						backgroundColor: 'rgba(255, 99, 132, 0.2)',
						tension: 0.4,
						fill: true,
						pointRadius: 5,
						pointHoverRadius: 7
					},
					{
						label: 'Min Temperatur',
						data: minTemps,
						borderColor: 'rgba(54, 162, 235, 1)',
						backgroundColor: 'rgba(54, 162, 235, 0.2)',
						tension: 0.4,
						fill: true,
						pointRadius: 5,
						pointHoverRadius: 7
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: true,
				plugins: {
					title: {
						display: true,
						text: 'Temperaturverlauf',
						color: 'rgba(255, 255, 255, 0.9)',
						font: {
							size: 18,
							weight: 'bold'
						}
					},
					tooltip: {
						mode: 'index',
						intersect: false,
						backgroundColor: 'rgba(0, 0, 0, 0.8)',
						titleColor: 'white',
						bodyColor: 'white',
						borderColor: 'rgba(255, 255, 255, 0.3)',
						borderWidth: 1,
						callbacks: {
							label: function (context) {
								return context.dataset.label + ': ' + context.parsed.y + '°C';
							}
						}
					}
				},
				scales: {
					y: {
						beginAtZero: false,
						ticks: {
							color: 'rgba(255, 255, 255, 0.8)',
							callback: function (value) {
								return value + '°C';
							}
						},
						grid: {
							color: 'rgba(255, 255, 255, 0.1)'
						}
					},
					x: {
						ticks: {
							color: 'rgba(255, 255, 255, 0.8)'
						},
						grid: {
							color: 'rgba(255, 255, 255, 0.1)'
						}
					}
				}
			}
		});

		return () => {
			if (chart) {
				chart.destroy();
			}
		};
	});
</script>

<div class="chart-container">
	<canvas bind:this={canvasElement}></canvas>
</div>

<style>
	.chart-container {
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(20px);
		border-radius: 20px;
		padding: 2rem;
		margin: 2rem auto;
		max-width: 800px;
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	canvas {
		max-height: 300px;
	}

	@media (max-width: 640px) {
		.chart-container {
			padding: 1rem;
		}

		canvas {
			max-height: 250px;
		}
	}
</style>
