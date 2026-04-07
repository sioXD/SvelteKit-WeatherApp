<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let mapElement: HTMLElement;
	let map: any;

	onMount(async () => {
		// Leaflet dynamisch importieren (Client-Side Only)
		const L = (await import('leaflet')).default;
		
		// Map Styles dynamisch importieren
		await import('leaflet/dist/leaflet.css');

		// Karte initialisieren, Fokus auf Mitteleuropa
		map = L.map(mapElement).setView([51.1657, 10.4515], 5);

		// Um den farbigen Niederschlag besonders deutlich von der Karte abzuheben, 
		// nutzen wir eine abgedunkelte Karten-Ebene (CartoDB Dark Matter)
		const darkBaseLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
			attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
			maxZoom: 18
		});

		// Klassische, helle OpenStreetMap als Alternative
		const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; OpenStreetMap',
			maxZoom: 18
		});

		// Niederschlags-Layer (OpenWeatherMap) - besonders hervorgehoben
		const precipLayer = L.tileLayer('/api/map?layer=precipitation_new&z={z}&x={x}&y={y}', {
			attribution: '&copy; OpenWeatherMap',
			maxZoom: 18,
			opacity: 1.0 // Volle Deckkraft für beste Sichtbarkeit
		});

		// Wolken-Layer als Ergänzung
		const cloudsLayer = L.tileLayer('/api/map?layer=clouds_new&z={z}&x={x}&y={y}', {
			attribution: '&copy; OpenWeatherMap',
			maxZoom: 18,
			opacity: 0.6
		});

		// Wir fügen standardmäßig die dunkle Basiskarte und den Niederschlag hinzu,
		// damit der Kontrast sofort optimal ist.
		darkBaseLayer.addTo(map);
		precipLayer.addTo(map);

		// Layer-Kontrolle
		const baseMaps = {
			"Karte (Dunkel)": darkBaseLayer,
			"Karte (Hell)": osmLayer
		};

		const overlayMaps = {
			"🌧️ Niederschlag (Aktiv)": precipLayer,
			"☁️ Wolken": cloudsLayer
		};

		L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);
	});

	onDestroy(() => {
		if (map) {
			map.remove(); // Aufräumen, um Speicherlecks zu verhindern
		}
	});
</script>

<svelte:head>
	<title>Niederschlagsradar</title>
</svelte:head>

<div class="app bg-default">
	<div class="map-wrapper">
		<div bind:this={mapElement} class="map-container"></div>

		<div class="header">
			<h1>Niederschlagsradar</h1>
			<p>Live-Ansicht für Regen, Schnee und Hagel. Die dunkle Karte bietet den besten Kontrast zur Erkennung.</p>
		</div>

		<!-- Legende zur optischen Unterscheidung -->
		<div class="legend">
			<div class="legend-item">
				<span class="color-box" style="background: rgba(225, 200, 100, 0.8)"></span> Leicht
			</div>
			<div class="legend-item">
				<span class="color-box" style="background: rgba(170, 70, 50, 0.8)"></span> Mäßig
			</div>
			<div class="legend-item">
				<span class="color-box" style="background: rgba(250, 0, 250, 0.8)"></span> Stark
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			sans-serif;
	}

	.app {
		min-height: 100vh;
		transition: background 0.5s ease;
		color: white;
		position: relative;
	}

	.bg-default {
		background: linear-gradient(135deg, #1a2f8b 0%, #270946 100%);
	}

	.map-wrapper {
		position: relative;
		height: 100vh;
		width: 100%;
		overflow: hidden;
	}

	.header {
		position: absolute;
		top: 1.25rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 1000;
		width: min(92vw, 960px);
		text-align: center;
		animation: fadeInDown 0.6s ease;
		background: rgba(0, 0, 0, 0.4);
		padding: 1.5rem;
		border-radius: 12px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.12);
	}

	@keyframes fadeInDown {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}

	h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2rem;
		color: #e2e8f0;
	}

	p {
		margin: 0;
		opacity: 0.9;
	}

	.map-container {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}

	.legend {
		position: absolute;
		bottom: 1.5rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 999;
		background: rgba(20, 20, 20, 0.85);
		padding: 10px 15px;
		border-radius: 8px;
		backdrop-filter: blur(5px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		gap: 15px;
		align-items: center;
		font-size: 0.85rem;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.color-box {
		width: 16px;
		height: 16px;
		border-radius: 4px;
		display: inline-block;
	}

	:global(.leaflet-container) {
		font-family: inherit;
	}
	
	:global(.leaflet-control-layers) {
		background: rgba(30, 30, 30, 0.9) !important;
		color: white !important;
		border: 1px solid rgba(255,255,255,0.2) !important;
		border-radius: 8px !important;
		box-shadow: 0 4px 15px rgba(0,0,0,0.4) !important;
		padding: 8px !important;
	}

	:global(.leaflet-control-layers-expanded) {
		padding: 12px !important;
	}

	@media (max-width: 768px) {
		.header {
			top: 0.75rem;
			padding: 1rem;
			width: min(94vw, 960px);
		}

		h1 {
			font-size: 1.5rem;
		}

		p {
			font-size: 0.92rem;
		}

		.legend {
			bottom: 0.75rem;
			left: 0.75rem;
			right: 0.75rem;
			transform: none;
			justify-content: space-between;
			gap: 8px;
			font-size: 0.78rem;
		}

		:global(.leaflet-control-layers) {
			margin-top: 160px !important;
		}
	}
</style>
