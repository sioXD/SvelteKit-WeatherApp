import { env } from '$env/dynamic/private';
import { error, type RequestHandler } from '@sveltejs/kit';

const API_KEY = env.API_KEY;
const ALLOWED_LAYERS = new Set(['precipitation_new', 'clouds_new']);

export const GET: RequestHandler = async ({ url, fetch }) => {
	const layer = url.searchParams.get('layer');
	const z = url.searchParams.get('z');
	const x = url.searchParams.get('x');
	const y = url.searchParams.get('y');

	if (!API_KEY) {
		throw error(500, 'API key is not configured');
	}

	if (!layer || !ALLOWED_LAYERS.has(layer)) {
		throw error(400, 'Invalid map layer');
	}

	if (!z || !x || !y) {
		throw error(400, 'Missing tile coordinates');
	}

	const tileUrl = `https://tile.openweathermap.org/map/${layer}/${z}/${x}/${y}.png?appid=${API_KEY}`;
	const tileResponse = await fetch(tileUrl);

	if (!tileResponse.ok) {
		throw error(tileResponse.status, 'Failed to fetch map tile');
	}

	const tileBuffer = await tileResponse.arrayBuffer();
	const contentType = tileResponse.headers.get('content-type') || 'image/png';

	return new Response(tileBuffer, {
		status: 200,
		headers: {
			'content-type': contentType,
			'cache-control': 'public, max-age=300, s-maxage=300'
		}
	});
};
