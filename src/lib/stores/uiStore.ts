import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Dark Mode Store mit LocalStorage Persistenz
function createDarkModeStore() {
	const storedValue = browser ? localStorage.getItem('darkMode') === 'true' : false;
	const { subscribe, set, update } = writable<boolean>(storedValue);

	return {
		subscribe,
		toggle: () =>
			update((value) => {
				const newValue = !value;
				if (browser) {
					localStorage.setItem('darkMode', String(newValue));
				}
				return newValue;
			}),
		set: (value: boolean) => {
			if (browser) {
				localStorage.setItem('darkMode', String(value));
			}
			set(value);
		}
	};
}

export const darkMode = createDarkModeStore();

// Favoriten Store mit LocalStorage Persistenz
function createFavoritesStore() {
	const storedFavorites = browser
		? JSON.parse(localStorage.getItem('favorites') || '[]')
		: [];
	const { subscribe, set, update } = writable<string[]>(storedFavorites);

	return {
		subscribe,
		add: (city: string) =>
			update((favorites) => {
				if (!favorites.includes(city)) {
					const newFavorites = [...favorites, city];
					if (browser) {
						localStorage.setItem('favorites', JSON.stringify(newFavorites));
					}
					return newFavorites;
				}
				return favorites;
			}),
		remove: (city: string) =>
			update((favorites) => {
				const newFavorites = favorites.filter((fav) => fav !== city);
				if (browser) {
					localStorage.setItem('favorites', JSON.stringify(newFavorites));
				}
				return newFavorites;
			}),
		toggle: (city: string) =>
			update((favorites) => {
				const newFavorites = favorites.includes(city)
					? favorites.filter((fav) => fav !== city)
					: [...favorites, city];
				if (browser) {
					localStorage.setItem('favorites', JSON.stringify(newFavorites));
				}
				return newFavorites;
			}),
		clear: () => {
			if (browser) {
				localStorage.setItem('favorites', JSON.stringify([]));
			}
			set([]);
		}
	};
}

export const favorites = createFavoritesStore();
