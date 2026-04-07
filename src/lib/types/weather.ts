// TypeScript Typen für die Wetter-App

export interface WeatherData {
	location: string;
	country: string;
	temperature: number;
	feelsLike: number;
	condition: string;
	description: string;
	humidity: number;
	windSpeed: number;
	icon: string;
	timestamp: number;
}

export interface ForecastDay {
	date: string;
	dayOfWeek: string;
	temperature: {
		min: number;
		max: number;
		day: number;
	};
	condition: string;
	description: string;
	humidity: number;
	windSpeed: number;
	icon: string;
}

export interface ForecastData {
	location: string;
	country: string;
	forecast: ForecastDay[];
}

export interface Coordinates {
	lat: number;
	lon: number;
}

export interface ApiError {
	message: string;
	code?: string;
}
