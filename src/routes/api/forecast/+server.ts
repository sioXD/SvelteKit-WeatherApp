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

		const response = await fetch(`${BASE_URL}/forecast?${queryParams}`);

		if (!response.ok) {
			if (response.status === 404) {
				return json({ error: 'Stadt nicht gefunden' }, { status: 404 });
			}
			throw new Error('API-Fehler');
		}

		const data = await response.json();

		// Gruppiere Vorhersagen nach Tagen
		const dailyForecasts = new Map();
		const daysOfWeek = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

		data.list.forEach((item: any) => {
			const date = new Date(item.dt * 1000);
			const dateStr = date.toISOString().split('T')[0];

			if (!dailyForecasts.has(dateStr)) {
				dailyForecasts.set(dateStr, {
					date: dateStr,
					dayOfWeek: daysOfWeek[date.getDay()],
					temperatures: [],
					conditions: [],
					humidity: [],
					windSpeed: [],
					icons: []
				});
			}

			const dayData = dailyForecasts.get(dateStr);
			dayData.temperatures.push(item.main.temp);
			dayData.conditions.push(item.weather[0].main);
			dayData.humidity.push(item.main.humidity);
			dayData.windSpeed.push(item.wind.speed);
			dayData.icons.push(item.weather[0].icon);
		});

		// Berechne Durchschnittswerte und formatiere
		const forecast = Array.from(dailyForecasts.values())
			.slice(0, 5)
			.map((day) => ({
				date: day.date,
				dayOfWeek: day.dayOfWeek,
				temperature: {
					min: Math.round(Math.min(...day.temperatures)),
					max: Math.round(Math.max(...day.temperatures)),
					day: Math.round(day.temperatures.reduce((a: number, b: number) => a + b, 0) / day.temperatures.length)
				},
				condition: day.conditions[0],
				description: day.conditions[0],
				humidity: Math.round(day.humidity.reduce((a: number, b: number) => a + b, 0) / day.humidity.length),
				windSpeed: Math.round((day.windSpeed.reduce((a: number, b: number) => a + b, 0) / day.windSpeed.length) * 3.6),
				icon: day.icons[Math.floor(day.icons.length / 2)]
			}));

		return json({
			location: data.city.name,
			country: data.city.country,
			forecast
		});
	} catch (error) {
		console.error('Forecast API Error:', error);
		return json(
			{ error: 'Fehler beim Abrufen der Vorhersagedaten' },
			{ status: 500 }
		);
	}
};
