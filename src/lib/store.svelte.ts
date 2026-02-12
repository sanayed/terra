// stores.js (or in your layout file)
import { setContext, getContext } from 'svelte';
import { writable } from 'svelte/store';
import type { AccessTokenUser } from '$lib/server/auth.js';

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

export type ContextMenuItem = {
	label: string;
	action: () => void;
	disabled?: boolean;
};

export type ContextMenuState = {
	x: number;
	y: number;
	items: ContextMenuItem[];
	visible: boolean;
};

const initialState: ContextMenuState = {
	x: 0,
	y: 0,
	items: [],
	visible: false
};

export const contextMenu = $state<ContextMenuState>(initialState);

export function openContextMenu(ctx: Omit<ContextMenuState, 'visible'>) {
	contextMenu.items = ctx.items;
	contextMenu.x = ctx.x;
	contextMenu.y = ctx.y;
	contextMenu.visible = true;
}

export function closeContextMenu() {
	contextMenu.visible = false;
}

interface User extends Partial<AccessTokenUser> {
	isAdmin?: boolean;
}
export let user = $state<User>({
	id: undefined,
	fullname: undefined,
	username: undefined,
	email: undefined,
	isAdmin: undefined
});

export function setUser(userP: User, isAdmin: boolean) {
	Object.assign(user, {
		...userP,
		isAdmin
	});
}
