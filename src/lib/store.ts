// stores.js (or in your layout file)
import { setContext, getContext } from 'svelte';
import { writable } from 'svelte/store';

// Create a unique context key
export const MY_STORE_KEY = Symbol('my-store-key');

// Initialize and provide the store
export function initMyStore(initialValue: unknown) {
	const store = writable(initialValue);
	setContext(MY_STORE_KEY, store);
	return store;
}

// Get the store in nested components
export function getMyStore() {
	return getContext(MY_STORE_KEY);
}
