import {
	makeTokens,
	setCookie,
	verifyAccessToken,
	verifyRefreshToken,
	type AccessTokenUser
} from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('accessToken');
	if (token) {
		try {
			const user = await verifyAccessToken(token); // decode/validate token
			event.locals.user = user as AccessTokenUser; // attach user to locals
		} catch (e: unknown) {
			if (e instanceof Error && e.name == 'TokenExpiredError') {
				try {
					const user = (await verifyRefreshToken(
						event.cookies.get('refreshToken') as string
					)) as AccessTokenUser;

					console.log('Refresh token verified');

					const [accessToken, refreshToken] = makeTokens({
						id: user.id,
						email: user.email,
						username: user.username
					});

					setCookie(event.cookies, { accessToken, refreshToken });
					event.locals.user = user as AccessTokenUser;
				} catch {
					event.locals.user = null;
				}
			}

			event.locals.user = null;
		}
	} else event.locals.user = null;

	return resolve(event);
};
