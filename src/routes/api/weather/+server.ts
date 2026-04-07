import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

const API_KEY = env.API_KEY || 'not found'; 
const BASE_URL = env.BASE_URL || 'https://api.openweathermap.org/data/2.5';


export const GET: RequestHandler = async ({ url }) => {
	const city = url.searchParams.get('city');
	const lat = url.searchParams.get('lat');
	const lon = url.searchParams.get('lon');

	if (!city && (!lat || !lon)) {
		return json(
			{ error: 'Bitte geben Sie eine Stadt oder Koordinaten an' },
			{ status: 400 }
		);
	}

	try {
		let queryParams = `appid=${API_KEY}&units=metric&lang=de`;

		if (city) {
			queryParams += `&q=${encodeURIComponent(city)}`;
		} else {
			queryParams += `&lat=${lat}&lon=${lon}`;
		}

		const response = await fetch(`${BASE_URL}/weather?${queryParams}`);

		if (!response.ok) {
			if (response.status === 404) {
				return json({ error: 'Stadt nicht gefunden' }, { status: 404 });
			}
			throw new Error('API-Fehler');
		}

		const data = await response.json();

		// Transformiere die API-Antwort in unser Format
		const weatherData = {
			location: data.name,
			country: data.sys.country,
			temperature: Math.round(data.main.temp),
			feelsLike: Math.round(data.main.feels_like),
			condition: data.weather[0].main,
			description: data.weather[0].description,
			humidity: data.main.humidity,
			windSpeed: Math.round(data.wind.speed * 3.6), // m/s zu km/h
			icon: data.weather[0].icon,
			timestamp: data.dt
		};

		return json(weatherData);
	} catch (error) {
		console.error('Weather API Error:', error);
		return json(
			{ error: 'Fehler beim Abrufen der Wetterdaten' },
			{ status: 500 }
		);
	}
};
