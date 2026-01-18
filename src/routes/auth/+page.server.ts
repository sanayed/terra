import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { createUser, verifyUser } from '$lib/server/auth';
import { setCookie } from '$lib/server/auth';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) throw redirect(303, '/app/');
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();

		const mode = data.get('mode');
		const email = String(data.get('email') || '').trim();
		const password = String(data.get('password') || '');
		const confirmPassword = String(data.get('password_confirm') || '');
		const username = String(data.get('username') || '').trim();
		const fullname = String(data.get('fullname') || '').trim();

		if (!emailRegex.test(email)) return fail(400, { error: 'Please enter a valid email address.' });

		if (!passwordRegex.test(password))
			return fail(400, {
				error:
					'Password must be at least 8 characters and include uppercase, lowercase, and a number.'
			});

		if (mode === 'signup') {
			if (username.length < 3)
				return fail(400, { error: 'Username must be at least 3 characters long.' });
			if (password !== confirmPassword) return fail(400, { error: 'Passwords do not match.' });

			try {
				const [accessToken, refreshToken] = await createUser({
					email,
					username,
					fullname,
					password
				});
				setCookie(cookies, { accessToken, refreshToken });
			} catch (error: unknown) {
				const message = error instanceof Error ? error.message : 'An unknown error occurred';
				return fail(400, { error: message });
			}
		}

		if (mode === 'login') {
			try {
				const [accessToken, refreshToken] = await verifyUser({ email, password });
				setCookie(cookies, { accessToken, refreshToken });
			} catch (error) {
				const message = error instanceof Error ? error.message : 'An unknown error occurred';
				return fail(400, { error: message });
			}
		}

		throw redirect(303, '/app');
	}
};
