import { writable } from 'svelte/store';
import type { WeatherData, ForecastData } from '$lib/types/weather';

// Store für aktuelles Wetter
export const currentWeather = writable<WeatherData | null>(null);

// Store für Wettervorhersage
export const forecastData = writable<ForecastData | null>(null);

// Store für Ladezustand
export const isLoading = writable<boolean>(false);

// Store für Fehlermeldungen
export const errorMessage = writable<string | null>(null);

// Store für aktuelle Suche
export const currentCity = writable<string>('');
